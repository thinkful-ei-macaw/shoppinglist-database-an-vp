const shopping = require("../src/shopping-list-service");
const knex = require("knex");
const { expect } = require("chai");

describe(`Shoppinglist service object`, function () {
  let db;
  let testShopping = [
    {
      id: 1,
      name: "Cherry blossom shake",
      price: "5.99",
      category: "Snack",
      date_added: new Date("1919-12-22T16:28:32.615Z"),
      checked: false,
    },
    {
      id: 2,
      name: "Shake shack burger",
      price: "5.99",
      category: "Lunch",
      date_added: new Date("2009-03-21T16:28:32.615Z"),
      checked: false,
    },
  ];

  before(() => {
    db = knex({
      client: "pg",
      connection: process.env.DB_URL,
    });
  });
  before(() => db("shopping_list").truncate());

  afterEach(() => db("shopping_list").truncate());

  after(() => db.destroy());
  context(`Given 'shopping_list' has data`, () => {
    beforeEach(() => {
      return db.into("shopping_list").insert(testShopping);
    });

    it(`GET returns data`, () => {
      const items = shopping.getAllItems(db);
      return items.then((results) => {
        expect(results.length).to.be.greaterThan(0);
      });
    });
    it(`GET one item by the ID`, () => {
      const thirdId = 2;
      const thirdTestShoppingList = testShopping[thirdId - 1];
      return shopping.getById(db, thirdId).then((actual) => {
        expect(actual).to.eql({
          id: thirdId,
          name: thirdTestShoppingList.name,
          price: thirdTestShoppingList.price,
          category: thirdTestShoppingList.category,
          date_added: thirdTestShoppingList.date_added,
          checked: thirdTestShoppingList.checked,
        });
      });
    });
    it('DELETE an item',()=>{
      
        const thirdId = 2;
        shopping.deleteItem(db, thirdId)
            .then(()=>{ shopping.getById(db,thirdId)
                .then((actual)=>{
                    expect(actual).to.eql(undefined)
                })
            })

    });
    it(`Update an existing shopping item`,()=>{
        const thirdId=2;
        const newItem = {
            id: 2,
      name: "In N Out",
      price: "6.99",
      category: "Lunch",
      date_added: new Date("2011-03-21T16:28:32.615Z"),
      checked: false,
        }
        return shopping.updateItem(db, thirdId, newItem)
            .then(()=>{shopping.getById(db,thirdId)
                .then(item =>{
                    expect(item).to.eql({
                        id: thirdId,
                        ...newItem,
                    })
                })
            })
    });
  });
  context(`Given 'shopping_list' has no data`, () => {
    it(`GET returns an empty array`, () => {
      const items = shopping.getAllItems(db);
      return items.then((results) => {
        expect(results.length).to.eql(0);
      });
    });
  });

});
