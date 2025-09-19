// Test script for vote aggregation function
// Run this with: node test-vote-aggregation.js

const testVoteAggregation = async () => {
  try {
    // Test the API endpoint
    const testEventId = 'test-event-123'
    const response = await fetch(`http://localhost:3001/api/events/${testEventId}/votes`)
    
    if (response.ok) {
      const data = await response.json()
      console.log('✅ API endpoint working:', data)
    } else {
      console.log('❌ API endpoint failed:', response.status, await response.text())
    }
  } catch (error) {
    console.log('❌ Test failed:', error.message)
  }
}

// Run the test
testVoteAggregation()
