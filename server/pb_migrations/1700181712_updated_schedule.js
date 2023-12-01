/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("rtzi2qg5c3f832f")

  collection.listRule = "@request.auth.company = company \n"
  collection.viewRule = "@request.auth.company = company "
  collection.createRule = "@request.auth.company = company && (@request.auth.permission = 'OWNER' || @request.auth.permission = 'MANAGER')"
  collection.updateRule = "@request.auth.company = company && (@request.auth.permission = 'OWNER' || @request.auth.permission = 'MANAGER')"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("rtzi2qg5c3f832f")

  collection.listRule = null
  collection.viewRule = null
  collection.createRule = null
  collection.updateRule = null

  return dao.saveCollection(collection)
})
