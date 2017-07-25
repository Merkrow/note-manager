var express = require('express')
  , _ = require('lodash')
  , router = express.Router()
  , store = require('./../store/store')
  , idGenerator = require('./../store/id-generator')

router
  .get('/', function (req, res) {
    res.send(store.directories)
  })
  .post('/', function (req, res) {
    var directory = _.pick(req.body, [
          'parentId',
          'name'
        ]
      )
      , parent = _.find(store.directories, function (dir) {
        return dir.id == directory.parentId
      })

    if (parent) {
      _.assign(directory, { id: idGenerator.getNext() })
      store.directories.push(directory)

      res.send(directory)
    } else {
      res.status(500).send('no parent')
    }
  })
  .put('/:id', function (req, res) {
    var directory = _.pick(req.body, [
          'id',
          'parentId',
          'name'
        ]
      )
      , oldEntityIndex = _.findIndex(store.directories, function (dir) {
        return dir.id == req.params.id
      })

    if (oldEntityIndex !== -1) {
      store.directories.splice(oldEntityIndex, 1, directory)
      res.send(directory)
    } else {
      res.status(500).send('no entity')
    }
  })
  .delete('/:id', function (req, res) {
    var directoryId = req.params.id

    if (directoryId == 1) {
      res.send(500).send('can not remove root directory')
      return
    }

    var entityIndex = _.findIndex(store.directories, function (dir) {
        return dir.id == directoryId
      })
      , directory = store.directories[entityIndex]

    if (entityIndex !== -1) {
      store.directories.splice(entityIndex, 1)
      res.send(directory)
    } else {
      res.status(500).send('no entity')
    }
  })

module.exports = router
