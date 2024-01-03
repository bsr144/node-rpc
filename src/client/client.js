const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const packageDefinition = protoLoader.loadSync("../../protos/user.proto");
const user_proto = grpc.loadPackageDefinition(packageDefinition).user;

function main() {
  const client = new user_proto.UserManager(
    "localhost:50051",
    grpc.credentials.createInsecure()
  );

  // Create a new user
  client.createUser(
    { name: "Alice", age: 30, email: "alice@example.com" },
    function (err, response) {
      console.log("CreateUser Response:", response);
    }
  );

  client.getUser({ id: "1704267763635" }, function (err, response) {
    console.log("GetUser Response:", response);
  });

  client.listUsers({}, function (err, response) {
    console.log("ListUsers Response:", response);
  });
}

main();
