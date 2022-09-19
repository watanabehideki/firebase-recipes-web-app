import { useState } from "react"
import "./App.css"
import LoginForm from "./components/LoginForm"
import FirebaseAuthService from "./FirebaseAuthService"
import AddEditRecipeForm from "./components/AddEditRecipeForm"
import FirebaseFireStoreService from "./FirebaseFireStoreService"

function App() {
  const [user, setUser] = useState(null)
  FirebaseAuthService.subscribeToAuthChanges(setUser)

  async function handleAddRecipe(newRecipe) {
    try {
      const response = await FirebaseFireStoreService.createDocument(
        "recipes",
        newRecipe
      )
      console.log(`response: ${JSON.stringify(response, null, 3)}`)

      // TODO: firestoreから新しいレシピを取得する
      alert(`succesfully created a resipe with an ID = ${response.Id}`)
    } catch (error) {
      alert(error.message)
    }
  }
  return (
    <div className="App">
      <div className="title-row">
        <h1 className="title">Firebase Recipes1</h1>
        <LoginForm existingUser={user} />
      </div>
      <div className="main">
        {user ? <AddEditRecipeForm handleAddRecipe={handleAddRecipe} /> : null}
      </div>
    </div>
  )
}

export default App
