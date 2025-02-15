echo "Installing root services with npm..."
ls -d /usr/src/node/services/*/ | xargs -I {} sh -c 'pnpm install {} && cp {}/.env.prod {}/.env && echo "Installed {}"'
echo "Installation complete."