require('dotenv').config();
const knex = require('knex');
const fn = process.argv[2];
const args = process.argv.slice(3);
const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL,
});
const funcs = {
  searchByProduceName(searchTerm) {
    knexInstance
      .select('id', 'name', 'price', 'date_added', 'checked', 'category')
      .from('shopping_list')
      .where('name', 'ILIKE', `%${searchTerm}%`)
      .then(result => {
        console.log(result);
      });
  },
  paginateProducts(pageNumber) {
    const productsPerPage = 6;
    const offset = productsPerPage * (pageNumber - 1);
    knexInstance
      .select('id', 'name', 'price', 'date_added', 'checked', 'category')
      .from('shopping_list')
      .limit(productsPerPage)
      .offset(offset)
      .then(result => {
        console.log(result);
      });
  },
  getMostRecentItems(daysAgo) {
    knexInstance
      .select('id', 'name', 'price', 'date_added', 'checked', 'category')
      .from('shopping_list') 
      .where(
        'date_added',
        '>',
        knexInstance.raw('now() - \'?? days\'::INTERVAL', daysAgo)
      )
      .then(result => {
        console.log(result);
      });
  },
  getTotalCostbyCategory() {
    knexInstance
      .select('category')
      .sum('price as total')
      .from('shopping_list')
      .groupBy('category')
      .then(result => {
        console.log(result);
      });
  }
}
funcs[fn](...args);
//drill 1
// function getAllItems(searchTerm){
//     return db
//         .select()
//         .from('shopping_list')
//         .where('name', 'ILIKE', `%${searchTerm}%`)
//         .then(result=>{
//             console.log(result)
//         })
//     }

// getAllItems('fish');


//drill 2
// function getItemsPaginated(pageNumber){
//     const productsPerPage = 6
//     //const offset = productsPerPage * (pageNumber - 1)
//     return db
//         .select()
//         .from('shopping_list')
//         .limit(productsPerPage)
//         //.offset(offset)
//         .then(result => {
//             console.log(result)
//         })

// }
// getItemsPaginated(1)

//drill 3
// function getItemsAfterDate(daysAgo){
//     return db
//         .select()
//         .from('shopping_list')
//         .where('date_added', '>', db.raw(`now() - '?? days'::INTERVAL`, daysAgo))
//         .then(results =>{
//             console.log(results)
//         })
// }

// getItemsAfterDate(30)

//drill 4
// function getTotalCost(){
//     return db
//         .select ('category')
//         .from('shopping_list')
//         .groupBy('category')
//         .sum('price as total')
//         .then(result=>{
//             console.log(result)
//         })
// }
// getTotalCost();