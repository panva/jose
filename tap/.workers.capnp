using Workerd = import "/workerd/workerd.capnp";

const config :Workerd.Config = (
  services = [
    (name = "main", worker = .tapWorker),
  ],

  sockets = [
    # Serve HTTP on port 8080.
    ( name = "http",
      address = "*:8080",
      http = (),
      service = "main"
    ),
  ]
);

const tapWorker :Workerd.Worker = (
  modules = [
    (name = "worker", esModule = embed "run-workers.js")
  ],
  compatibilityDate = "2022-09-16",
);
