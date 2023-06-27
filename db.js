// import pg from "pg";
// const Pool = pg.Pool;

// const poolConfig = process.env.DATABASE_URL
//   ? {
//       connectionString: process.env.DATABASE_URL,
//       ssl: {
//         rejectUnauthorized: false,
//       },
//     }
//   : {
//       user: "postgres",
//       password: "password",
//       host: "localhost",
//       port: 5432,
//       database: "eduvilla",
//     };

// const pool = new Pool(poolConfig);

// export default pool;

import pg from "pg";

var conString =
  "postgres://anosjxqz:NlS9hn4EesSI8OaEtyMoI_-YjERXuxLo@ruby.db.elephantsql.com/anosjxqz";

var client = new pg.Client(conString);

client.connect(function (err) {
  if (err) {
    return console.error("could not connect to postgres", err);
  }
  return console.error("connected");
});

export default client;
