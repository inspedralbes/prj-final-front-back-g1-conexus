# Install all services with npm
echo "Installing root services with npm..."

for service in /usr/src/node/services/*; do
    if [ -d "$service" ]; then
        echo "Entering service directory: $service"
        for subdir in "$service"/*; do
            if [ -d "$subdir" ]; then
                echo "Installing subdir: $subdir"
                npm install
            fi
        done
    fi
done

echo "Installation complete."