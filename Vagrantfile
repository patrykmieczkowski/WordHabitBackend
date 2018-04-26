# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  config.vm.box = "bento/ubuntu-16.04"
  config.vm.synced_folder ".", "/home/vagrant/shared"
  config.vm.network "forwarded_port", guest: 8000, host: 8000

  config.vm.provision "shell", inline: <<-SHELL
    # Required packages
    sudo apt-get update
    sudo apt-get upgrade -y
    sudo apt-get install -y -f
    sudo apt-get install -y curl wget rsync

    # Node.js
    curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
    sudo apt-get install -y nodejs build-essential g++ gyp
    echo "export NODE_ENV=development" >> /home/vagrant/.bashrc

    # Cassandra
    echo "deb http://www.apache.org/dist/cassandra/debian 311x main" | sudo tee -a /etc/apt/sources.list.d/cassandra.sources.list
    curl https://www.apache.org/dist/cassandra/KEYS | sudo apt-key add -
    sudo apt-get update
    sudo apt-get install -y cassandra

    # The below does not work during provisioning but has to be executed manually afterwards
    # sudo service cassandra stop
    # sudo rm -rf /var/lib/cassandra/data/system/*
    # sudo sed -i \
    #   -e "s/^\(cluster_name: \)\{1\}.*$/\1'WordHabit'/g" \
    #   -e "s/^\(authenticator: \)\{1\}.*$/\1PasswordAuthenticator/g" \
    #   -e "s/^\(authorizer: \)\{1\}.*$/\1CassandraAuthorizer/g" \
    #   -e "s/^\(role_manager: \)\{1\}.*$/\1CassandraRoleManager/g" \
    #   /etc/cassandra/cassandra.yaml
    # sudo service cassandra start

    # nginx
    sudo apt-get install -y -f
    sudo apt-get install -y nginx
    cat <<EOF > /etc/nginx/conf.d/WordHabitBackend.conf
server {
  listen      8000 default_server;
  server_name _;

  location /media/ {
    alias /home/vagrant/WordHabitBackend/media/;
    autoindex off;
  }

  location /panel/static/ {
    alias /home/vagrant/WordHabitBackend/dist/static/;
    autoindex off;
  }

  location / {
    proxy_pass http://127.0.0.1:8001;
    proxy_set_header Host \\$host;
    proxy_set_header X-Forwarded-For \\$remote_addr;
  }
}
EOF
    sed -i "s|include \/etc\/nginx\/sites-enabled\/\*|# include \/etc\/nginx\/sites-enabled\/\*|g" /etc/nginx/nginx.conf
    sudo service nginx restart

    # Project
    mkdir /home/vagrant/WordHabitBackend
    sudo chown vagrant /home/vagrant/WordHabitBackend
    echo 'alias sync="rsync -a --exclude={.git,.idea,.vagrant,node_modules} /home/vagrant/shared/. /home/vagrant/WordHabitBackend"' >> /home/vagrant/.bashrc
    echo 'alias prod="export NODE_ENV=production"' >> /home/vagrant/.bashrc
    echo 'alias dev="export NODE_ENV=development"' >> /home/vagrant/.bashrc

  SHELL
end
