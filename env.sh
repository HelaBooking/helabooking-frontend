#!/bin/sh

# Recreate the config file
echo "window._env_ = {" > /usr/share/nginx/html/env-config.js

# Read env vars starting with REACT_APP_ or VITE_
# Change 'REACT_APP_' to 'VITE_' below if you are using Vite variables
printenv | grep -E "^(REACT_APP_|VITE_)" | awk -F = '{ print "  \"" $1 "\": \"" $2 "\"," }' >> /usr/share/nginx/html/env-config.js

# Close the object
echo "}" >> /usr/share/nginx/html/env-config.js

# Execute the passed command (starts Nginx)
exec "$@"