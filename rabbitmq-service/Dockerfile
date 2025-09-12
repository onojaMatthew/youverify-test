# Use the official RabbitMQ image with the management plugin
FROM rabbitmq:management

# Set environment variables (Optional, if you want to customize user credentials)
ENV RABBITMQ_DEFAULT_USER=guest
ENV RABBITMQ_DEFAULT_PASS=guest

# Expose the RabbitMQ AMQP and management web UI ports
EXPOSE 5672 15672

# You can add custom configurations, plugins, or files here
# For example, if you want to include a configuration file, you can COPY it like so:
COPY ./rabbitmq.conf /etc/rabbitmq/

# The official image already runs RabbitMQ by default
# So no need to specify the command, as it is defined in the parent image
