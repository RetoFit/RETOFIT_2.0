package router

import (
	"RetoFit-App/services/physical_activities_service/internal/app/rest_api/handlers"

	"github.com/gin-gonic/gin"
)

func RegisterPublicEndpoints(router *gin.Engine, ActivityHandlers *handlers.Activity) {
	router.GET("/activities/users/:id/activities", ActivityHandlers.GetAllActivitiesByUser)
	router.GET("/activities/:id", ActivityHandlers.GetActivity)
	router.POST("/activities/users/:id/activities", ActivityHandlers.CreateActivity)
	router.PUT("/activities/update/:id", ActivityHandlers.UpdateActivity)
	router.DELETE("/activities/:id", ActivityHandlers.DeleteActivity)
}
