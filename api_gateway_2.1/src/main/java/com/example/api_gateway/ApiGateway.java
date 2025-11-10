package com.example.api_gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@EnableConfigurationProperties(UriConfiguration.class)
@RestController
public class ApiGateway {

	public static void main(String[] args) {
		SpringApplication.run(ApiGateway.class, args);
	}

	@Bean
	public RouteLocator retoFitRoutes(RouteLocatorBuilder builder, UriConfiguration uriConfiguration) {
		String authServiceUri = uriConfiguration.getAuthServiceUri();
		String activitiesServiceUri = uriConfiguration.getActivitiesServiceUri();
		String gamificationServiceUri = uriConfiguration.getGamificationServiceUri();
		String usersServiceUri = uriConfiguration.getUsersServiceUri();
		String postsServiceUri = uriConfiguration.getPostsServiceUri();
		String adminServiceUri = uriConfiguration.getAdminServiceUri();

		return builder.routes()
			.route(p -> p								// Ruta para el auth service
				.path("/api/auth/**")
				.filters(f -> f
					.stripPrefix(1)
				)
				.uri(authServiceUri)
			)
			.route(p -> p				                // Ruta para el admin auth service
				.path("/api/auth_admin/admin/**")
				.filters(f -> f
					.stripPrefix(2)
				)
				.uri(authServiceUri)
			)
			.route(p -> p				               // Ruta para el activities service      
				.path("/api/activities/**")
				.filters(f -> f
					.stripPrefix(1)
				)
				.uri(activitiesServiceUri)
			)
			.route(p -> p				               // Ruta para el gamification service   
				.path("/api/gamification/**")
				.filters(f -> f
					.stripPrefix(1)
				)
				.uri(gamificationServiceUri)
			)
			.route(p -> p				               // Ruta para el users service 
				.path("/api/users/**")
				.filters(f -> f
					.stripPrefix(1)
				)
				.uri(usersServiceUri)
			)
			.route(p -> p				               // Ruta para el admin users service
				.path("/api/users_admin/admin/**")
				.filters(f -> f
					.stripPrefix(2)
				)
				.uri(usersServiceUri)
			)
			.route(p -> p				               // Ruta para el posts service
				.path("/api/posts/**")
				.filters(f -> f
					.stripPrefix(1)
				)
				.uri(postsServiceUri)
			)
			.route(p -> p				              // Ruta para el admin service  
				.path("/api/admin/**")
				.filters(f -> f
					.stripPrefix(1)
				)
				.uri(adminServiceUri)
			)
			.build();
	}
}

@ConfigurationProperties
class UriConfiguration {
	private String authServiceUri = "http://auth-service:8001";
	private String activitiesServiceUri = "http://activities-service:8002";
	private String gamificationServiceUri = "http://gamification-service:8003";
	private String usersServiceUri = "http://users-service:8004";
	private String postsServiceUri = "http://posts-service:8005";
	private String adminServiceUri = "http://admin-service:8006";

		// Getters and Setters
	public String getAuthServiceUri() {
		return authServiceUri;
	}

	public void setAuthServiceUri(String authServiceUri) {
		this.authServiceUri = authServiceUri;
	}

	public String getActivitiesServiceUri() {
		return activitiesServiceUri;
	}

	public void setActivitiesServiceUri(String activitiesServiceUri) {
		this.activitiesServiceUri = activitiesServiceUri;
	}

	public String getGamificationServiceUri() {
		return gamificationServiceUri;
	}

	public void setGamificationServiceUri(String gamificationServiceUri) {
		this.gamificationServiceUri = gamificationServiceUri;
	}

	public String getUsersServiceUri() {
		return usersServiceUri;
	}

	public void setUsersServiceUri(String usersServiceUri) {
		this.usersServiceUri = usersServiceUri;
	}

	public String getPostsServiceUri() {
		return postsServiceUri;
	}

	public void setPostsServiceUri(String postsServiceUri) {
		this.postsServiceUri = postsServiceUri;
	}

	public String getAdminServiceUri() {
		return adminServiceUri;
	}

	public void setAdminServiceUri(String adminServiceUri) {
		this.adminServiceUri = adminServiceUri;
	}
}
	    
