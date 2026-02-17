#!/bin/bash

# Configuration script for Day Zero Stream Deck Plugin
# This script generates configuration files from templates

set -e

echo "======================================"
echo "Day Zero Plugin Configuration"
echo "======================================"
echo ""

# Check if template files exist
if [ ! -f "manifest.json.template" ]; then
  echo "Error: manifest.json.template not found"
  exit 1
fi

if [ ! -f "build-plugin.sh.template" ]; then
  echo "Error: build-plugin.sh.template not found"
  exit 1
fi

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
echo "Generating configuration files from templates..."

# Generate manifest.json from template
echo "  → Generating manifest.json"
sed "s/{{DOMAIN}}/$DOMAIN/g; s/{{PLUGIN_ID}}/$PLUGIN_ID/g" manifest.json.template > manifest.json

# Generate build-plugin.sh from template
echo "  → Generating build-plugin.sh"
sed "s/{{DOMAIN}}/$DOMAIN/g; s/{{PLUGIN_ID}}/$PLUGIN_ID/g" build-plugin.sh.template > build-plugin.sh

# Make build script executable
chmod +x build-plugin.sh

echo ""
echo "✓ Configuration complete!"
echo ""
echo "Generated files:"
echo "  • manifest.json (from template)"
echo "  • build-plugin.sh (from template)"
echo ""
echo "Your plugin is now configured with:"
echo "  Bundle ID: $DOMAIN.$PLUGIN_ID.sdPlugin"
echo "  Action UUID: $DOMAIN.$PLUGIN_ID.action"
echo ""
echo "⚠️  Note: manifest.json and build-plugin.sh are gitignored"
echo "   They are generated locally and should NOT be committed to Git"
echo ""
echo "Next steps:"
echo "  1. Build plugin: ./build-plugin.sh"
echo "  2. Install plugin: open $DOMAIN.$PLUGIN_ID.sdPlugin"
echo ""
