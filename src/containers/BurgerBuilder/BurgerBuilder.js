import React, { useState, useEffect, useCallback } from 'react'
import { useDispatch, useSelector} from 'react-redux'
import axios from '../../axios-orders'
import Auxilliary from '../../hoc/Auxilliary/Auxilliary'
import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from '../../components/UI/Modal/Modal'
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'
import Spinner from '../../components/UI/Spinner/Spinner'
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'
import * as actions from '../../store/actions/index'


const BurgerBuilder = props => {

    const [purchasing, setPurchasing] = useState(false)


    const dispatch = useDispatch()

    const ings = useSelector(state => state.burger.ingredients)
    const price = useSelector(state => state.burger.totalPrice)
    const error = useSelector(state => state.burger.error)
    const isAuthenticated = useSelector(state => state.auth.token)

    const onIngredientAdded = (ingName) => dispatch(actions.addIngredient(ingName))
    const onIngredientRemoved = (ingName) => dispatch(actions.removeIngredient(ingName))
    const onInitIngredients = useCallback(() => dispatch(actions.initIngredients()), [dispatch])
    const onInitPurchase = () => dispatch(actions.purchaseInit())
    const onSetAuthRedirectPath = (path) => dispatch(actions.setAuthRediredctPath(path))

    
        useEffect(() => {
            onInitIngredients()
        }, [onInitIngredients])

    const updatePurchaseState = ( ingredients ) => {
        const sum = Object.keys( ingredients )
            .map( igKey => {
                return ingredients[igKey];
            } )
            .reduce( ( sum, el ) => {
                return sum + el;
            }, 0 );
        return sum > 0;
    }

  
    const purchaseHandler = () => {
        if(isAuthenticated) {
            setPurchasing(true)
        } else {
            onSetAuthRedirectPath('/checkout')
            props.history.push('/auth')
        }
        
    }

    const purchaseCancelHendler = () => {
        setPurchasing(false)
    }

    const purchaseContinueHandler = () => {


        onInitPurchase()
        props.history.push('/checkout')


    }
   

   
        const disabledInfo = {
            ...ings
        }

        for ( let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }
        let orderSummary = null

        
        let burger = error ? <p>Ingredients can't be loaded!</p> : <Spinner/>;

        if(ings){
            burger = (
                <Auxilliary>
                <Burger  ingredients={ings}/>
                    <BuildControls
                        disabled={disabledInfo} 
                        ingredientRemoved={onIngredientRemoved}
                        ingredientAdded={onIngredientAdded}
                        purchaseable={updatePurchaseState(ings)}
                        ordered={purchaseHandler}
                        isAuth={isAuthenticated}
                        price={price}
                        />
                        </Auxilliary>
            )
            orderSummary = <OrderSummary 
                                price={price}
                                ingredients={ings}
                                purchaseCancelled={purchaseCancelHendler}
                                purchaseContinued={purchaseContinueHandler}
                                />
    
        }
        
        return (
            <Auxilliary>
                <Modal show={purchasing} modalClosed={purchaseCancelHendler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Auxilliary>
        )
    
}

// const mapStateToProps = state => {
//     return {
//         ings: state.burger.ingredients,
//         price: state.burger.totalPrice,
//         error:state.burger.error,
//         isAuthenticated: state.auth.token,
//     }
// }

// const mapDispatchToProps = dispatch => {
//     return {
//         onIngredientAdded: (ingName) => dispatch(actions.addIngredient(ingName)),
//         onIngredientRemoved: (ingName) => dispatch(actions.removeIngredient(ingName)),
//         onInitIngredients: () => dispatch(actions.initIngredients()),
//         onInitPurchase:() => dispatch(actions.purchaseInit()),
//         onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRediredctPath(path))
//     }
// }

export default withErrorHandler(BurgerBuilder, axios)
// export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));