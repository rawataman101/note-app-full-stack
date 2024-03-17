const express = require("express");
const router = express.Router();
const Todos = require("../../models/todo.model");

/**
 * Get all TODOS:
 * curl http://localhost:8082/v1/todos
 *
 * Get todos with their "startDate" b/w startDateMin and startDateMax
 * curl http://localhost:8082/v1/todos?startDateMin=2020-11-04&startDateMax=2020-12-30
 *
 */

router.get("/", async (req, res) => {
  //  console.log(
  //    `URL:  /v1/todos${req.url == "/" ? "" : req.url}, Method:  ${req.method}, Timestamp: ${new Date()}`
  //  );
  if (req.query.startDateMax && req.query.startDateMin) {
    let startDateMax = new Date(req.query.startDateMax);
    startDateMax.setTime(startDateMax.getTime());
    let startDateMin = new Date(req.query.startDateMin);
    startDateMin.setTime(startDateMin.getTime());
    Todos.find(
      {
        startDate: {
          $lte: startDateMax,
          $gte: startDateMin,
        },
      },
      (err, allTodos) => {
        if (err) {
          console.log(err);
        } else {
          res.send(allTodos);
        }
      }
    );
  } else if (req.query.pending) {
    Todos.find({ pending: req.query.pending }, (err, allTodos) => {
      if (err) {
        console.log(err);
        res.status(500).send();
      } else {
        res.send(allTodos);
      }
    });
  } else {
    Todos.find({}, (err, allTodos) => {
      if (err) {
        console.log(err);
        res.status(500).send();
      } else {
        res.send(allTodos);
      }
    });
  }
});

/**
 * Add a TODO to the list
 * curl -X POST http://localhost:8082/v1/todos \
    -d '{"name": "Learn Nodejs by doing","startDate": "2021-01-07","endDate": "2021-01-09"}' \
    -H 'Content-Type: application/json'
*/

router.post("/", async (req, res) => {
  //  console.log(
  //    `URL:  /v1/todos${req.url == "/" ? "" : req.url}, Method:  ${req.method}, Timestamp: ${new Date()}`
  //  );
  console.log("Request body: ", req.body);

  let newTodo = {
    name: req.body.name,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
  };
  const newlyCreated = await Todos.create(newTodo, (err, newlyCreated) => {
    if (err) {
      console.log(err);
      res.status(500).send();
    } else {
      console.log("New todo item: ", newlyCreated);
      res.status(201).send(newlyCreated);
    }
  });
});

/**
 * Update an existing TODO
 * curl -v -X PUT http://localhost:8082/v1/todos \
    -d '{"_id": "<id-value>", "name": "Play tennis","startDate": "2021-01-07","endDate": "2021-01-09"}' \
    -H 'Content-Type: application/json'
 * 
 * Nb: You'll need to change the "id" value to that of one of your todo items
*/
router.put("/", (req, res) => {
  console.log("Request body: ", req.body);
  const idToUpdate = req.body._id;
  const updatedTodo = {
    name: req.body.name,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    pending: req.body.pending,
  };
  Todos.findByIdAndUpdate(idToUpdate, updatedTodo, (err, doc) => {
    if (err) {
      console.log(err);
      res.status(500).send();
    } else {
      console.log("Updated todo item: ", updatedTodo);
      res.status(201).send(updatedTodo);
    }
  });
});

/**
 * Delete a TODO from the list
 * curl -v -X "DELETE" http://localhost:8082/v1/todos/<id-value>
 *
 * Nb: You'll need to change "<id-value>" to the "id" value of one of your todo items
 */
router.delete("/:id", async (req, res) => {
  const IdToDelete = req.params.id;
  // console.log(
  //   `URL:  /v1/todos${req.url == "/" ? "" : req.url}, Method:  ${req.method}, Timestamp: ${new Date()}`
  // );

  const result = await Todos.findByIdAndDelete(IdToDelete, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send();
    } else {
      res.status(204).send();
      console.log("Deleted!");
    }
  });
});

module.exports = router;
