package com.example.api_gateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class CorsConfig {

    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration corsConfig = new CorsConfiguration();

        // ✅ Permitir origen de tu frontend (Next.js)
        corsConfig.setAllowedOrigins(List.of("http://localhost:3000"));

        // ✅ Métodos HTTP permitidos
        corsConfig.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // ✅ Headers permitidos
        corsConfig.setAllowedHeaders(List.of("*"));

        // ✅ Permitir enviar cookies/autenticación si lo necesitas
        corsConfig.setAllowCredentials(true);

        // ✅ Tiempo máximo de cacheo del preflight
        corsConfig.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfig);

        return new CorsWebFilter(source);
    }
}
