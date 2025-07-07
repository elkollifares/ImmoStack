package com.example.immoquebec.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;

import javax.annotation.PostConstruct;
import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

@Configuration
public class DatabaseConfig {

    @Autowired
    private DataSource dataSource;

    @PostConstruct
    public void init() {
        try (Connection connection = dataSource.getConnection()) {
            try (Statement statement = connection.createStatement()) {
                // Vérifiez si UserRole existe déjà
                ResultSet rs = statement.executeQuery("SELECT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'userrole')");
                if (rs.next() && !rs.getBoolean(1)) {
                    statement.execute("CREATE TYPE UserRole AS ENUM ('ADMIN', 'COMMON_USER');");
                }

                // Vérifiez si AdType existe déjà
                rs = statement.executeQuery("SELECT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'adtype')");
                if (rs.next() && !rs.getBoolean(1)) {
                    statement.execute("CREATE TYPE AdType AS ENUM ('SALE', 'RENT');");
                }
            }
        } catch (SQLException e) {
            System.err.println("Error executing SQL: " + e.getMessage());
            e.printStackTrace();
        }
    }
}