require("dotenv").config();
const knex = require("knex");

const db = knex({
  client: "pg",
  connection: process.env.DB_URL
});


function mostPopularVideosForDays(days) {
  db
    .select('video_name', 'region')
    .count('date_viewed AS views')
    .where(
      'date_viewed',
      '>',
      db.raw(`now() - '?? days'::INTERVAL`, days)
    )
    .from('whopipe_video_views')
    .groupBy('video_name', 'region')
    .orderBy([
      { column: 'region', order: 'ASC' },
      { column: 'views', order: 'DESC' },
    ])
    .then(result => {
      console.log(result)
    })
}

mostPopularVideosForDays(30)


// function getProductsWithImages() {
//   db
//     .select('product_id', 'name', 'price', 'category', 'image')
//     .from('amazong_products')
//     .whereNotNull('image')
//     .then(result => {
//       console.log(result)
//     })
// }

// getProductsWithImages();




// function paginateProducts(page) {
//   const productsPerPage = 15;
//   const offset = productsPerPage * (page - 1);
//   db
//     .select('product_id', 'name', 'price', 'category')
//     .from('amazong_products')
//     .limit(productsPerPage)
//     .offset(offset)
//     .then(result => {
//       console.log(result)
//     })
// }

// paginateProducts(2);


// function searchByProduceName(searchTerm){
// db.from("amazong_products")
//   .select()
//   .where("name", "ILIKE", `%${searchTerm}%`)
//   .then(result => {
//     console.log(result);
//   })
// }
// searchByProduceName('holo')