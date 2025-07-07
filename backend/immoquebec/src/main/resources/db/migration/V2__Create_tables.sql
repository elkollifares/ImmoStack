-- Créez les tables dans le bon ordre

-- Créez d'abord la table users
CREATE TABLE IF NOT EXISTS users (
                                   id SERIAL PRIMARY KEY,
                                   email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  username VARCHAR(50) NOT NULL UNIQUE,
  user_role UserRole DEFAULT 'COMMON_USER' NOT NULL
  );

-- Puis la table ads
CREATE TABLE IF NOT EXISTS ads (
                                 id SERIAL PRIMARY KEY,
                                 ad_name VARCHAR(100) NOT NULL,
  description VARCHAR(500) NOT NULL,
  plot_surface DOUBLE PRECISION NOT NULL,
  price INT NOT NULL,
  number_of_bedrooms INT NOT NULL,
  number_of_bathrooms INT NOT NULL,
  floor_number INT DEFAULT 0,
  date_created TIMESTAMP,
  last_updated TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  address_id INT NOT NULL,
  ad_type AdType NOT NULL,
  user_id INT NOT NULL,
  CONSTRAINT address_unique UNIQUE (address_id),
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id)
  );

-- Enfin la table users_favorites
CREATE TABLE IF NOT EXISTS users_favorites (
                                             user_id INT NOT NULL,
                                             ad_id INT NOT NULL,
                                             CONSTRAINT fk_users_favorites_user FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT fk_users_favorites_ad FOREIGN KEY (ad_id) REFERENCES ads(id)
  );
