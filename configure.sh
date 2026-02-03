#!/bin/bash

# Configuration script for Day Zero Stream Deck Plugin
# This script helps you customize the plugin with your own unique identifiers

set -e

echo "======================================"
echo "Day Zero Plugin Configuration"
echo "======================================"
echo ""

# Function to prompt for input with a default value
prompt_with_default() {
  local prompt="$1"
  local default="$2"
  local result

  read -p "$prompt [$default]: " result
  echo "${result:-$default}"
}

# Get configuration values
echo "Configure your unique plugin identifiers:"
echo ""

DOMAIN=$(prompt_with_default "Your reverse domain (e.g., com.yourcompany)" "com.yourdomain")
PLUGIN_ID=$(prompt_with_default "Plugin identifier (lowercase, no spaces)" "dayzero")

echo ""
echo "Configuration Summary:"
echo "  Domain: $DOMAIN"
echo "  Plugin ID: $PLUGIN_ID"
echo "  Bundle ID: $DOMAIN.$PLUGIN_ID.sdPlugin"
echo "  Action UUID: $DOMAIN.$PLUGIN_ID.action"
echo ""

read -p "Is this correct? (y/n): " confirm
if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
  echo "Configuration cancelled."
  exit 1
fi

echo ""
echo "Configuring plugin files..."

# Update manifest.json
echo "  → Updating manifest.json UUID"
sed -i '' "s/\"UUID\": \"com\..*\.action\"/\"UUID\": \"$DOMAIN.$PLUGIN_ID.action\"/" manifest.json

# Update build-plugin.sh
echo "  → Updating build-plugin.sh"
sed -i '' "s/PLUGIN_NAME=\".*\"/PLUGIN_NAME=\"$DOMAIN.$PLUGIN_ID.sdPlugin\"/" build-plugin.sh

echo ""
echo "✓ Configuration complete!"
echo ""
echo "Your plugin is now configured with:"
echo "  Bundle ID: $DOMAIN.$PLUGIN_ID.sdPlugin"
echo "  Action UUID: $DOMAIN.$PLUGIN_ID.action"
echo ""
echo "Next steps:"
echo "  1. Build plugin: ./build-plugin.sh"
echo "  2. Install plugin: open $DOMAIN.$PLUGIN_ID.sdPlugin"
echo ""
