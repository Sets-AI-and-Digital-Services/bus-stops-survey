#!/bin/bash

echo "🔧 Usage: ./deploy-frontend.sh <TARGET_DIR> <PORT>"
echo ""

TARGET_DIR=$1
PORT=$2
REPO_URL="git@github.com:Sets-AI-and-Digital-Services/bus-stops-survey.git"

BRANCH="adding-filter"
SERVICE_NAME="uo_frontend_${PORT}.service"

# Validate inputs
if [ -z "$TARGET_DIR" ] || [ -z "$PORT" ]; then
    echo "❌ Error: Missing arguments."
    echo "✅ Correct usage: ./deploy-frontend.sh <TARGET_DIR> <PORT>"
    echo "📌 Example: ./deploy-frontend.sh ~/frontend/uo_assistant_frontend 5175"
    exit 1
fi

# Clone or pull latest code
if [ -d "$TARGET_DIR" ]; then
    echo "⚠️ Directory $TARGET_DIR exists. Pulling latest changes..."
    cd "$TARGET_DIR" || exit
    git checkout "$BRANCH"
    git pull origin "$BRANCH"
else
    echo "📦 Cloning project into $TARGET_DIR..."
    git clone --branch "$BRANCH" "$REPO_URL" "$TARGET_DIR"
    cd "$TARGET_DIR" || exit
fi

# Ensure correct Node version
source "$HOME/.nvm/nvm.sh"
nvm install 20
nvm use 20
nvm alias default 20
NODE_VERSION=$(nvm version | sed 's/v//')

# Clean install dependencies
echo "📦 Cleaning and installing npm dependencies..."
rm -rf node_modules package-lock.json
npm install

# Create systemd service file
SERVICE_FILE="/etc/systemd/system/$SERVICE_NAME"

echo "🛠️ Creating systemd service: $SERVICE_NAME"

cat <<EOF | sudo tee "$SERVICE_FILE" > /dev/null
[Unit]
Description=UO Frontend on port $PORT
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$TARGET_DIR
ExecStart=$(which npm) run dev -- --port $PORT --host 0.0.0.0
Restart=always
Environment=NODE_ENV=production
Environment=PATH=$HOME/.nvm/versions/node/$(node -v)/bin:/usr/bin:/bin

[Install]
WantedBy=multi-user.target
EOF

# Reload and start service
echo "🔄 Reloading systemd and starting service..."
sudo systemctl daemon-reload
sudo systemctl enable "$SERVICE_NAME"
sudo systemctl restart "$SERVICE_NAME"

# Check status
echo "✅ Service $SERVICE_NAME started on port $PORT"
sudo systemctl status "$SERVICE_NAME" --no-pager

