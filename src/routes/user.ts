import express from "express";
import { userOperations } from "../useroperation";
import { usersOperations } from "../useroperations.model";
const router = express.Router();
router.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});
const client = require("../connection");
import cors from "cors";
const corsOption = {
  origin: "http://localhost:4200",
  optionsSuccessStatus: 200,
};
router.use(cors(corsOption));

router.get("/", async (req, res) => {
  await client.query(
    `select  *,(SELECT array_to_json(array_agg( row_to_json(address.*))) as address  from address where users.userid=address.userid) from  users;
`,
    (err, result) => {
      if (!err) {
        res.send(result.rows);
      }
    }
  );
  client.end;
});

router.post("/", async (req, res) => {
  const user: userOperations = req.body;
  let innerQuery = "";
  let userId;
  const classobj = new usersOperations(req.body);
  classobj.user;
  let arr = [
    req.body.mailingdetails,
    req.body.billingdetails,
    req.body.residencydetails,
  ];

  let insertQuery = `insert into users(suffix,firstname,middlename,lastname,email,phonenumber)
                       values('${user.suffix}', '${classobj.capitalize(
    classobj.user.firstname
  )}','${user.middlename}', '${classobj.capitalize(
    classobj.user.lastname
  )}', '${user.email}','${user.phonenumber}') RETURNING userid`;

  await client.query(insertQuery, (error, response) => {
    if (!error) {
      userId = response.rows[0].userid;
      let commonQuery = `insert into address(userid,addresstype,address,city,state,postcode) values`;
      for (let i = 0; i < arr.length; i++) {
        innerQuery += `('${userId}','${arr[i].addressType}','${arr[i].address}','${arr[i].city}','${arr[i].state}','${arr[i].postcode}')`;
        if (i < arr.length - 1) {
          innerQuery += ",";
        }
      }
      let finalQuery = commonQuery + innerQuery;

      client.query(finalQuery, (err, result) => {
        if (!err) {
          res.send("Inserted was successful");
        } else {
          console.log(err.message);
        }
      });
      client.end;
    }
  });
});

router.get("/:userid", async (req, res) => {
  await client.query(
    `   select *,(SELECT array_to_json(array_agg( row_to_json(address.*))) as address 
  from address where users.userid=${req.params.userid} and address.userid=${req.params.userid}) from users where userid =${req.params.userid};
`,
    (err, result) => {
      if (!err) {
        res.status(200).send(result.rows[0]);
      }
    }
  );
  client.end;
});

router.put("/:userid", async (req, res) => {
  let billing = req.body.billingdetails;

  let residency = req.body.residencydetails;

  let mailing = req.body.mailingdetails;

  let addressarray = [billing, residency, mailing];

  let updatedQuery = "";
  let query = "";
  let userId;
  let user: userOperations = req.body;
  let Query = "";

  let updateQuery = `update users
                     set suffix='${user.suffix}',
                     phonenumber='${user.phonenumber}',
                     firstname = '${user.firstname}',
                     middlename = '${user.middlename}',
                      lastname = '${user.lastname}',
                     email = '${user.email}'
                     where userid = ${user.userid} ;`;

  await client.query(updateQuery, async (err, result) => {
    if (!err) {
      return res.send("Update was successful");
    } else {
      console.log(err.message);
    }
    client.end;
  });
  userId = user.userid;

  for (let i = 0; i < addressarray.length; i++) {
    query += `update  address set  addresstype='${addressarray[i].addresstype}',
    address='${addressarray[i].address}',city='${addressarray[i].city}',
    state='${addressarray[i].state}',postcode='${addressarray[i].postcode}' 
    where id=${addressarray[i].id} and userid= ${user.userid}; `;
  }

  let UpdateQuery = query;

  client.query(UpdateQuery, (err, result) => {
    if (!err) {
    } else {
      console.log(err.message);
    }
    client.end;
  });
});

router.delete("/:userid", async (req, res) => {
  let insertQuery = `delete from address  where userid=${req.params.userid} ;delete from users where userid=${req.params.userid}`;

  await client.query(insertQuery, (err, result) => {
    if (!err) {
      res.send("Deleted Successfully");
    } else {
      console.log(err.message);
    }
  });
  client.end;
});
client.connect();

module.exports = router;
