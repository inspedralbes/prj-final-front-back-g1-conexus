# Install all services with pnpm
# Si no funciona, le haces un dos2unix
echo "Installing root services with pnpm..."

for service in /usr/src/node/services/*; do
    if [ -d "$service" ]; then
        echo "Entering service directory: $service"
        for subdir in "$service"/*; do
            if [ -d "$subdir" ]; then
                cp .env.prod .env
                echo "Installing subdir: $subdir"
                pnpm install --frozen-lockfile
            fi
        done
    fi
done

echo "Installation complete."