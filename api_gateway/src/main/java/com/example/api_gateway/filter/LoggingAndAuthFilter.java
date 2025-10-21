package com.example.api_gateway.filter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
@Order(1)
public class LoggingAndAuthFilter implements GlobalFilter {
    private static final Logger log = LoggerFactory.getLogger(LoggingAndAuthFilter.class);

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String path = exchange.getRequest().getPath().value().toString();
        String method = exchange.getRequest().getMethod().name();
        HttpHeaders headers = exchange.getRequest().getHeaders();

        log.info("[GATEWAY] {} {}", method, path);

        // Rutas públicas que NO requieren Authorization
        if (path.startsWith("/public") || path.startsWith("/health") || path.startsWith("/frontend")) {
            return chain.filter(exchange);
        }

        if (!headers.containsKey("Authorization")) {
            log.warn("🚫 Missing Authorization header for {}", path);
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        return chain.filter(exchange)
                .doOnSuccess(aVoid -> log.info("✅ Request processed successfully: {}", path))
                .doOnError(error -> log.error("❌ Error processing request: {}", error.getMessage()));
    }
}
