package router

import (
	"RetoFit-App/services/physical_activities_service/internal/app/rest_api/handlers"

	"github.com/gin-gonic/gin"
)

func RegisterPublicEndpoints(router *gin.Engine, ActivityHandlers *handlers.Activity) {
	router.GET("/activities/users/:id/activities", ActivityHandlers.GetAllActivitiesByUser)
	router.GET("/activities/user/:id/activity/:id_activty", ActivityHandlers.GetActivity)
	router.POST("/activities/users/:id/activities", ActivityHandlers.CreateActivity)
	router.PUT("/activities/user/:id/update/:id_activity", ActivityHandlers.UpdateActivity)
	router.DELETE("/activities/user/:id/delete/:id_activity", ActivityHandlers.DeleteActivity)
}
