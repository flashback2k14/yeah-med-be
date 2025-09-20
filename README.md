# yeah-med-be

backend for medication management

## docker

- commands
  - START daemon
    ```bash
      colima start
    ```
  - BUILD AND START
    ```bash
      docker-compose up --build -d
    ```
  - LOGS
    ```bash
    docker-compose logs -f
    ```
  - DOWN
    ```bash
    docker-compose down
    ```
  - LIST
    ```bash
    docker image ls
    ```
  - REMOVE
    ```bash
    docker image rm -f <IMAGE>
    ```