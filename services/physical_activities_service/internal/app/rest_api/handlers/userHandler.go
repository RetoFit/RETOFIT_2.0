package handlers

import (
	"net/http"

	"RetoFit-App/services/physical_activities_service/internal/app/rest_api/models/dtos"
	"RetoFit-App/services/physical_activities_service/internal/app/rest_api/services"

	"github.com/gin-gonic/gin"
)

type UserHandler struct {
	UserService *services.User
}

func NewUserHandler(userService *services.User) *UserHandler {
	return &UserHandler{UserService: userService}
}

// CreateUser maneja la petición POST para crear una referencia de usuario.
func (uh *UserHandler) CreateUser(c *gin.Context) {
	var request dtos.CreateUserRequest

	// Valida que el JSON de entrada sea correcto
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	// Llama al servicio para procesar la lógica
	if errResp := uh.UserService.CreateUser(&request); errResp != nil {
		c.JSON(errResp.Code, gin.H{"error": errResp.Message})
		return
	}

	// Responde con éxito
	c.JSON(http.StatusCreated, gin.H{"message": "User reference created successfully"})
}
