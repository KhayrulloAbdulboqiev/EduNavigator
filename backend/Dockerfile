FROM php:8.2-apache

# Install PDO and mysqli extensions
RUN apt-get update && apt-get install -y \
    libzip-dev \
    zip \
  && docker-php-ext-install pdo_mysql mysqli zip

# Enable Apache mod_rewrite in case there are .htaccess files
RUN a2enmod rewrite

# Update virtual host to map /var/www/html appropriately if needed
ENV APACHE_DOCUMENT_ROOT /var/www/html

COPY . /var/www/html/
COPY uploads.ini /usr/local/etc/php/conf.d/


# Update permissions
RUN chown -R www-data:www-data /var/www/html/ \
    && chmod -R 755 /var/www/html/
