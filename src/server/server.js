const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const packageDefinition = protoLoader.loadSync("../../protos/user.proto");
const user_proto = grpc.loadPackageDefinition(packageDefinition).user;

// In-memory user store
const users = {};

function createUser(call, callback) {
  const user = call.request;
  const id = Date.now().toString(); // Generate ID from date
  users[id] = user;
  callback(null, { ...user, id: id, status: "Created" });
}

function getUser(call, callback) {
  const user = users[call.request.id];
  if (user) {
    callback(null, { ...user, id: call.request.id, status: "Retrieved" });
  } else {
    callback({
      code: grpc.status.NOT_FOUND,
      details: "User not found",
    });
  }
}

function listUsers(call, callback) {
  const userList = Object.entries(users).map(([id, user]) => ({
    ...user,
    id: id,
    status: "Retrieved",
  }));
  callback(null, { users: userList });
}

function main() {
  const server = new grpc.Server();
  server.addService(user_proto.UserManager.service, {
    createUser: createUser,
    getUser: getUser,
    listUsers: listUsers,
  });
  server.bind("0.0.0.0:50051", grpc.ServerCredentials.createInsecure());
  server.start();
  console.log("User Management gRPC server running on port 50051");
}

main();
