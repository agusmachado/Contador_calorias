import { useState, ChangeEvent, FormEvent, Dispatch, useEffect } from "react"
import { v4 as uuidv4 } from 'uuid'
import { categories } from "../data/categories"
import type { Activity } from "../types"
import { ActivityActions, ActivityState } from "../reducers/activity-reducer"

type FormProps = {
  dispatch: Dispatch<ActivityActions>,
  state: ActivityState
}

const initialState : Activity ={
    id: uuidv4(),
    category: 1,
    name: '',
    calories: 0,
}

export default function Form({dispatch, state} : FormProps) {

  const [activity, setActivity] = useState<Activity>(initialState)

  useEffect( () => {
    if (state.activeId) {
      //console.log('Ya hay algo en ActiveId')
      //console.log(state.activeId)
      const selectedActivity = state.activities.filter( stateActivity => stateActivity.id === state.activeId )[0]
      setActivity(selectedActivity)
    }
  }, [state.activeId])


    const handleChange = (e: ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLInputElement>) => {
    //console.log(e.target.id)
    //console.log('Algo cambió...')
    //console.log(e.target.value)
    
    const isNumberField = ['category', 'calories'].includes(e.target.id)
    //console.log(isNumberField)

    setActivity({
      ...activity,
      //[e.target.id]: e.target.value
      [e.target.id]: isNumberField ? +e.target.value : e.target.value
    })
  }

  const isValidActivity = () => {
    const { name, calories } = activity
    //console.log(name.trim() !== '' && calories > 0)
    return name.trim() !== '' && calories > 0
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    //console.log("Submit...")
    dispatch({ type: 'save-activity', payload: {newActivity: activity} })

    setActivity({
      ...initialState,
      id: uuidv4()
    })
  }
  
  return (
    <form 
      className=" space-y-5 bg-white shadow p-10 rounded-lg"
      onSubmit={handleSubmit}
    >
      <div className=" grid grid-cols-1 gap-3">
        <label htmlFor="category" className=" font-bold">Categoría:</label>
        <select  
          className=" border border-slate-300 p-2 rounded-lg w-full bg-white"
          id="category"
          value={activity.category}
          onChange={handleChange}
        >
          { categories.map(category => (
            <option
              key={category.id}
              value={category.id}
            >
              {category.name}
            </option>
          ))}
        </select>
      </div>

    <div className=" grid grid-cols-1 gap-3">
      <label htmlFor="name" className=" font-bold">Actividad:</label>
      <input 
        id="name"
        type="text"
        className=" border border-slate-300 p-2 rounded-lg"
        placeholder="Ej. Comida, Jugo de Naranja, Ensalada, Ejercicio, Pesas, Bicicleta..."
        value={activity.name}
        onChange={handleChange}
      />
    </div>

    <div className=" grid grid-cols-1 gap-3">
      <label htmlFor="calories" className=" font-bold">Calorías:</label>
      <input 
        id="calories"
        type="number"
        className=" border border-slate-300 p-2 rounded-lg"
        placeholder="Calorías Ej. 300 o 500"
        value={activity.calories}
        onChange={handleChange}
      />
    </div>

    <input 
      type="submit" 
      className=" bg-gray-800 hover:bg-gray-900 w-full p-2 font-bold uppercase text-white cursor-pointer disabled:opacity-30"
      value={activity.category === 1 ? 'Guardar Comida' : 'Guardar Ejercicio'}
      disabled={!isValidActivity()}
    />
    </form>
  )
}
