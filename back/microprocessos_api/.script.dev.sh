echo "Installing root services with npm..."
ls -d /usr/src/node/services/*/ | xargs -I {} sh -c 'npm install --prefix {} && cp {}/.env.dev {}/.env && echo "Installed {}"'
echo "Installation complete."