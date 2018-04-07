WordHabitBackend
================

Backend and administration panel application for WordHabit.


Development
-----------

`Vagrant >= 2.0.0` is recommended for development. To setup a development VM in
the project directory run:

    >>> vagrant provision

When the provisioning is finished, bring the machine up and SSH into it:

    >>> vagrant up
    >>> vagrant ssh

To shutdown the VM run:

    >>> vagrant halt

The recommended way to use the development VM is to make changes on the host
machine and then use `sync` command to copy the source on VM:

    >>> sync

To run the application locally run:

    >>> npm start


Deployment
----------

`Docker >=  18.03.0-ce` is recommended for deployment. Firstly create a default
local Docker bridge network:

    >>> docker network create word_habit_network

Then run and configure a container with Cassandra database:

    >>> docker run -d \
          --name cassandra \
          --network word_habit_network \
          cassandra:3.11.2
    >>> docker exec -it cassandra sh
    >>># service cassandra stop
    >>># rm -rf /var/lib/cassandra/data/system/*
    >>># sed -i \
           -e "s/^\(cluster_name: \)\{1\}.*$/\1'WordHabit'/g" \
           -e "s/^\(authenticator: \)\{1\}.*$/\1PasswordAuthenticator/g" \
           -e "s/^\(authorizer: \)\{1\}.*$/\1CassandraAuthorizer/g" \
           -e "s/^\(role_manager: \)\{1\}.*$/\1CassandraRoleManager/g" \
           /etc/cassandra/cassandra.yaml
    >>># exit
    >>> docker restart cassandra
    >>> docker exec -it cassandra service cassandra start

It's important to have the `serviceAccountKey.json` from Firebase in the project
root directory. Go to Firebase and download (generate if not yet generated) the
service account key and place it in the project root directory. Call the file
`serviceAccountKey.json`.

Finally the application container is ready to be built and brought up. Copy and
paste `Dockerfile.sample` file and call it `Dockerfile`. It's a good idea to
adjust settings in the `# Configuration` section and after that run:

    >>> docker build -t word_habit_backend .
    >>> docker run -d \
          --name word_habit_backend \
          --network word_habit_network \
          --publish 8000:80 \
          --volume /home/vagrant/WordHabitBackend/media:/www/data/WordHabitBackend/media \
          word_habit_backend

When deploying for the first time, the database migrations have to be applied:

    >>> docker exec -it word_habit_backend sh
    >>># cd /root/WordHabitBackend/scripts
    >>># chmod +x *.sh
    >>># ./migrate.sh "../migrations/cassandra/01-create-keyspace.cql"
    >>># ./migrate.sh "../migrations/cassandra/02-create-user.cql"
    >>># ./migrate.sh "../migrations/cassandra/03-grant-select-to-user.cql"
    >>># ./migrate.sh "../migrations/cassandra/04-grant-modify-to-user.cql"
    >>># ./migrate.sh "../migrations/cassandra/05-create-table-admin.cql"
    >>># ./migrate.sh "../migrations/cassandra/06-create-table-admin_session.cql"
    >>># ./migrate.sh "../migrations/cassandra/07-create-table-service_account_key.cql"
    >>># ./migrate.sh "../migrations/cassandra/08-create-table-topic.cql"
    >>># ./migrate.sh "../migrations/cassandra/09-create-table-word.cql"
    >>># ./add_service_account_key.sh "../serviceAccountKey.json" "https://database-url.firebaseio.com/"
    >>># ./add_topic.sh "english" "EN" "PL" "PROD"
    >>># ./create_admin.sh "username" "password"
