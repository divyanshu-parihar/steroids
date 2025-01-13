package main

import (
	"fmt"
	"net"
	"sync"
	"time"
	"math/rand"
	"log"
)

func createConnection(wg *sync.WaitGroup, id int) {
	defer wg.Done()
	conn, err := net.Dial("tcp", "localhost:8080")
	if err != nil {
		log.Printf("Connection %d failed: %v", id, err)
		return
	}
	defer conn.Close()

	// Simulate some work with the connection
	time.Sleep(time.Duration(rand.Intn(1000)) * time.Millisecond)
}

func stopResponses() {
	// Placeholder function to stop responses from connections
	// Implementation depends on the specific requirements
}

func showStatistics(totalConnections int, startTime time.Time) {
	duration := time.Since(startTime)
	fmt.Printf("Total connections: %d\n", totalConnections)
	fmt.Printf("Total time taken: %v\n", duration)
}

func main() {
	const totalConnections = 100000
	var wg sync.WaitGroup

	startTime := time.Now()

	for i := 0; i < totalConnections; i++ {
		wg.Add(1)
		go createConnection(&wg, i)
	}

	wg.Wait()

	stopResponses()
	showStatistics(totalConnections, startTime)
}
