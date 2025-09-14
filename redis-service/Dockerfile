# Use the official Redis image as the base
FROM redis

# Optional: Add custom Redis configuration file if you want to modify the default settings
COPY ./redis.conf /usr/local/etc/redis/redis.conf

# Expose Redis default port
EXPOSE 6379

# Set the default command to run Redis with the custom config if necessary
# If you are using a custom config file, uncomment the next line:
CMD ["redis-server", "/usr/local/etc/redis/redis.conf"]

# By default, the official Redis image will run the default config
# CMD ["redis-server"]
