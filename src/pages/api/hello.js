import sql from "mssql/msnodesqlv8";

const config = {
  server: "BMINP5718-2304\\SQLEXPRESS",
  driver: "msnodesqlv8",
  database: "React_DD",
  options: {
    trustedConnection: true,
  },
};

const hello = (req, res) => {
  const GET = async () => {
    try {
      await sql.connect(config);
      const result = await sql.query("SELECT * FROM practice");
      const recordes = result.recordset;
      return res.json(recordes);
    } catch (err) {
      console.log(err);
    } finally {
      sql.close();
    }
  };

  const POST = async () => {
    const data = req.body;
    try {
      const pool = await sql.connect(config);
      if (data.fname) {
        const query = `INSERT INTO practice (fname, lname, age) VALUES (@fname, @lname, @age)`;
        await pool
          .request()
          .input("fname", sql.VarChar, data.fname)
          .input("lname", sql.VarChar, data.lname)
          .input("age", sql.Int, data.age)
          .query(query);
        return res.json({ data: "inserted" });
      } else {
        const query = `DELETE FROM practice WHERE id=@id`;
        await pool.request().input("id", sql.Int, data.id).query(query);
        return res.json({ data: "deleted" });
      }
    } catch (err) {
      console.log(err);
    } finally {
      sql.close();
    }
  };

  const PUT = async () => {
    const data = req.body;
    try {
      const pool = await sql.connect(config);
      const query = `UPDATE practice SET fname=@fname,lname=@lname,age=@age WHERE id=@id`;
      await pool
        .request()
        .input("fname", sql.VarChar, data.fname)
        .input("lname", sql.VarChar, data.lname)
        .input("age", sql.Int, data.age)
        .input("id", sql.Int, data.id)
        .query(query);
      return res.json({ data: "updated" });
    } catch (err) {
      console.log(err);
    } finally {
      sql.close();
    }
  };

  if (req.method === "GET") {
    GET();
  }
  if (req.method === "POST") {
    POST();
  }
  if (req.method === "PUT") {
    PUT();
  }
};
export default hello;
