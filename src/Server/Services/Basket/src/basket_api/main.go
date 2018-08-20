package main

import (
	"basket_api/common"
	"basket_api/controllers"
	_ "basket_api/docs"
	"basket_api/repositories"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/gomodule/redigo/redis"
	"github.com/swaggo/gin-swagger"
	"github.com/swaggo/gin-swagger/swaggerFiles"
)

// @title Basket API
// @version 1.0
// @description This is a rest api for basket which saves items to redis server
// @termsOfService http://swagger.io/terms/

// @contact.name API Support
// @contact.url http://www.swagger.io/support
// @contact.email support@swagger.io

// @license.name Apache 2.0
// @license.url http://www.apache.org/licenses/LICENSE-2.0.html

// @host localhost:5000
// @BasePath /api/
func main() {

	router := gin.Default()
	redisPool, err := initRedis()

	if err != nil {
		return
	}

	basketRepository := repositories.NewRedisBasketRepository(redisPool)
	controller := controllers.NewBasketController(basketRepository)

	api := router.Group("/api")
	{
		basket := api.Group("basket")
		{
			basket.GET(":id", controller.Get)
			basket.POST("", controller.Create)
		}
	}

	router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	// Home page should be redirected to swagger page
	router.GET("/", func(c *gin.Context) {
		c.Redirect(http.StatusMovedPermanently, "/swagger/index.html")
	})

	router.Run(":5000")
}

func initRedis() (*redis.Pool, error) {
	redisHost := os.Getenv("REDIS_HOST")
	if redisHost == "" {
		redisHost = ":6379"
	}
	pool := common.NewRedisPool(redisHost)
	common.CleanupHook(pool)

	err := common.HealthCheck(pool)

	return pool, err
}