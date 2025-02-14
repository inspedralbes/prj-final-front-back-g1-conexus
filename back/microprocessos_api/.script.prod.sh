# Install all services with pnpm
echo "Installing root services with pnpm..."

for service in /usr/src/node/services/*; do
    if [ -d "$service" ]; then
        echo "Entering service directory: $service"
        for subdir in "$service"/*; do
            if [ -d "$subdir" ]; then
                echo "Installing subdir: $subdir"
                pnpm install --frozen-lockfile
            fi
        done
    fi
done

echo "Installation complete."