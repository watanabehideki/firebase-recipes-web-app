import { useState } from "react"

function AddEditRecipeForm({ handleAddRecipe }) {
  const [name, setName] = useState("")
  const [category, setCategory] = useState("")
  const [publishDate, setPublishDate] = useState(
    new Date().toISOString().split("T"[0])
  )
  const [directions, setDirections] = useState("")
  const [ingredients, setIngredients] = useState([])
  const [ingredientName, setIngredientName] = useState("")

  function handleRecipeFormSubmit(e) {
    e.preventDefault()
    if (ingredients.length === 0) {
      alert("材料は入力必須です。")
      return
    }

    const isPublished = new Date(publishDate) <= new Date()

    const newRecipe = {
      name,
      category,
      directions,
      publishDate: new Date(publishDate),
      isPublished,
      ingredients,
    }

    handleAddRecipe(newRecipe)
  }

  function handleAddIngredient(e) {
    if (e.key && e.key !== "Enter") {
      return
    }

    e.preventDefault()

    if (!ingredientName) {
      alert("材料が入力されていません。入力欄を再確認してください")
      return
    }

    setIngredients([...ingredients, ingredientName])
    setIngredientName("")
  }

  return (
    <form
      onSubmit={handleRecipeFormSubmit}
      className="add-edit-recipe-form-container"
    >
      <h2>レシピの追加・編集</h2>
      <div className="top-form-section">
        <div className="fields">
          <label className="recipe-label input-label">
            レシピ名：
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-text"
            />
          </label>
          <label className="recipe-label input-label">
            カテゴリー：
            <select
              className="select"
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value=""></option>
              <option value="breadsSandwichesAndPizza">
                パン、サンドウィッチ、ピザ
              </option>
              <option value="eggsAndBreakfast">たまごと朝食</option>
              <option value="dessertsAndBakedGoods">デザートと焼き菓子</option>
              <option value="fishAndSeafood">魚とシーフード</option>
              <option value="veg">野菜</option>
            </select>
          </label>
          <label className="recipe-label input-label">
            説明：
            <textarea
              required
              value={directions}
              onChange={(e) => setDirections(e.target.value)}
              className="input-text directions"
            />
          </label>
          <label className="recipe-label input-label">
            公開日：
            <input
              type="date"
              required
              value={publishDate}
              onChange={(e) => setPublishDate(e.target.value)}
              className="input-text"
            />
          </label>
        </div>
      </div>
      <div className="ingredients-list">
        <h3 className="text-center">材料</h3>
        <table className="ingredients-table">
          <thead>
            <tr>
              <th className="table-header">材料</th>
              <th className="table-header">削除</th>
            </tr>
          </thead>
          <tbody>
            {ingredients && ingredients.length > 0
              ? ingredients.map((ingredient) => {
                  return (
                    <tr key={ingredient}>
                      <td className="table-data text-center">{ingredient}</td>
                      <td className="ingredient-delete-box">
                        <button
                          type="button"
                          className="secondary-button ingredient-delete-button"
                        >
                          削除
                        </button>
                      </td>
                    </tr>
                  )
                })
              : null}
          </tbody>
        </table>
        {ingredients && ingredients.length === 0 ? (
          <h3 className="text-center no-ingredients">
            材料がまだ追加されていません
          </h3>
        ) : null}
        <div className="ingredient-form">
          <label className="ingredient-label">
            材料：
            <input
              type="text"
              value={ingredientName}
              onChange={(e) => setIngredientName(e.target.value)}
              className="input-text"
              placeholder="例. 砂糖 大さじ１杯"
              onKeyPress={handleAddIngredient}
            />
          </label>
          <button
            type="button"
            className="primary-button add-ingredient-button"
            onClick={handleAddIngredient}
          >
            材料を追加
          </button>
        </div>
      </div>
      <div className="action-buttons">
        <button type="submit" className="primary-button action-button">
          レシピを作成
        </button>
      </div>
    </form>
  )
}

export default AddEditRecipeForm
