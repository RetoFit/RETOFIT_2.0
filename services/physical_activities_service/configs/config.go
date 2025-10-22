package configs

import (
	"RetoFit-App/services/physical_activities_service/internal/app/rest_api/constants"
	"fmt"
	"net/http"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

type Config struct {
	Server   serverConfig
	Database databaseConfig
}

type serverConfig struct {
	Address string
}

type databaseConfig struct {
	DatabaseDriver string
	DatabaseSource string
}

func NewConfig() *Config {
	err := godotenv.Load("./configs/dev.env")

	if err != nil {
		fmt.Print(err)
		panic("Error loading .env file")
	}

	c := &Config{
		Server: serverConfig{
			Address: GetEnvOrPanic(constants.EnvKeys.ServerAddress),
		},
		Database: databaseConfig{
			DatabaseDriver: GetEnvOrPanic(constants.EnvKeys.DBDriver),
			DatabaseSource: GetEnvOrPanic(constants.EnvKeys.DBSource),
		},
	}

	return c
}

func GetEnvOrPanic(key string) string {
	value := os.Getenv(key)
	if value == "" {
		panic(fmt.Sprintf("environment variable %s not set", key))
	}

	return value
}

func (conf *Config) CorsNew() gin.HandlerFunc {
	allowedOrigin := GetEnvOrPanic(constants.EnvKeys.CorsAllowedOrigin)

	return cors.New(cors.Config{
		AllowMethods: []string{http.MethodGet, http.MethodPost, http.MethodPut, http.MethodDelete, http.MethodOptions}, // Añadido OPTIONS
		AllowHeaders: []string{
			constants.Headers.Origin,
			"Content-Type",
			"Authorization", // Cabecera para el token JWT
		},
		ExposeHeaders:    []string{constants.Headers.ContentLength},
		AllowCredentials: true,
		AllowOriginFunc: func(origin string) bool {
			fmt.Println(origin)
			return origin == allowedOrigin
		},
		MaxAge: constants.MaxAge,
	})
}
