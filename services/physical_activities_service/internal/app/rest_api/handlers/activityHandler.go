package handlers

import (
	"errors"
	"fmt"
	"net/http"
	"strconv"

	"RetoFit-App/services/physical_activities_service/internal/app/rest_api/models/dtos"
	"RetoFit-App/services/physical_activities_service/internal/app/rest_api/services"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
)

type Activity struct {
	ActivityService *services.Activity
}

func NewActivityHandler(activityService *services.Activity) *Activity {
	return &Activity{ActivityService: activityService}
}

func (h *Activity) GetAllActivitiesByUser(ctx *gin.Context) {
	userId, errId := strconv.Atoi(ctx.Param("id"))

	if errId != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "User ID not valid"})

		return
	}

	allActivities, err := h.ActivityService.GetAllActivitiesByUser(userId)
	if err != nil {
		ctx.AbortWithStatusJSON(err.Code, err)

		return
	}

	ctx.JSON(http.StatusOK, allActivities)
}

func (h *Activity) GetActivity(ctx *gin.Context) {
	activityID, err := strconv.Atoi(ctx.Param("id"))

	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Activity ID not valid"})

		return
	}

	Activity, ActivityErr := h.ActivityService.GetActivity(activityID)
	if ActivityErr != nil {
		ctx.AbortWithStatusJSON(ActivityErr.Code, ActivityErr)

		return
	}

	ctx.JSON(http.StatusOK, Activity)
}

func (h *Activity) DeleteActivity(ctx *gin.Context) {
	activityID, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Activity ID not valid"})

		return
	}

	deleteError := h.ActivityService.DeleteActivity(activityID)
	if deleteError != nil {
		ctx.AbortWithStatusJSON(deleteError.Code, deleteError)

		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Activity deleted"})
}

func (h *Activity) CreateActivity(ctx *gin.Context) {
	var createActivityRequest dtos.CreateActivityRequest

	userId, errId := strconv.Atoi(ctx.Param("id"))

	if errId != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "User ID not valid"})

		return
	}

	if err := ctx.ShouldBindJSON(&createActivityRequest); err != nil {
		var ve validator.ValidationErrors
		if errors.As(err, &ve) {
			out := make(map[string]string)
			for _, fe := range ve {
				out[fe.Field()] = msgForTag(fe)
			}
			ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"errors": out})

			return
		}
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})

		return
	}

	createActivityResponse, signupError := h.ActivityService.CreateActivity(userId, &createActivityRequest)
	if signupError != nil {
		ctx.AbortWithStatusJSON(signupError.Code, signupError)

		return
	}

	ctx.JSON(http.StatusCreated, createActivityResponse)
}

func (h *Activity) UpdateActivity(ctx *gin.Context) {
	ActivityID, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Activity ID not valid"})

		return
	}

	var updateActivityRequest dtos.UpdateActivityRequest

	if err := ctx.ShouldBindJSON(&updateActivityRequest); err != nil {
		var ve validator.ValidationErrors
		if errors.As(err, &ve) {
			out := make(map[string]string)
			for _, fe := range ve {
				out[fe.Field()] = msgForTag(fe)
			}
			ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"errors": out})

			return
		}
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})

		return
	}

	updateError := h.ActivityService.UpdateActivity(ActivityID, &updateActivityRequest)
	if updateError != nil {
		ctx.AbortWithStatusJSON(updateError.Code, updateError)

		return
	}

	ctx.JSON(http.StatusNoContent, gin.H{"message": "Activity updated"})
}

func msgForTag(fe validator.FieldError) string {
	switch fe.Tag() {
	case "required":
		return "This field is required"
	case "min":
		return fmt.Sprintf("Minimum length is %s", fe.Param())
	case "custom_password":
		return "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character"
	default:
		return "Invalid value"
	}
}
