import {useState} from 'react'

export const useItemCart=(input=[])=>{
    const [cart, changeCart] = useState(input)

    const addtoCart= (item)=>{
        
        const index = cart.findIndex(cartItem=>{
          return cartItem.itemName ===item.itemName
        })

        var itemPrice, itemqty, itemdisc, subTotal
        let curDiscount = parseInt(item.discount)
          if(index>=0)
          {
            if (curDiscount<0)
            {
              itemqty =  parseInt(item.qty)+ parseInt(cart[index].qty)
              itemPrice = item.sPrice - curDiscount
              subTotal = parseInt(itemPrice*itemqty)
              var newCart = cart
              newCart[index].qty = itemqty
              newCart[index].discount = 0
              newCart[index].sPrice= itemPrice
              newCart[index].subTotal= subTotal
              changeCart(newCart)
            }else
            {
              itemPrice = item.sPrice 
              itemqty =  parseInt(item.qty)+ parseInt(cart[index].qty)
              itemdisc = parseInt(item.discount) > parseInt(cart[index].discount) ? parseInt(item.discount) :  parseInt(cart[index].discount )
              subTotal = parseInt(itemPrice*itemqty - itemqty*itemdisc)
              var newCart = cart
              newCart[index].qty = itemqty
              newCart[index].discount = itemdisc
              newCart[index].subTotal= subTotal
              changeCart(newCart)
            }
      
            }
          else{
            itemqty = item.qty
            
            if(curDiscount<0)
            {
              
              itemPrice = item.sPrice - curDiscount
              itemdisc=0
            }
            else
            {
              itemPrice = item.sPrice
              itemdisc = curDiscount
             
            }
            subTotal = parseInt(itemPrice*itemqty - itemqty*itemdisc)
            var newItem = {...item, subTotal, discount:itemdisc, sPrice:itemPrice, discount:itemdisc }
              changeCart([...cart, newItem])
          }
  
    }
    const deleteFromCart=(i)=>{
        changeCart([
          ...cart.slice(0, i),
          ...cart.slice(i + 1, cart.length)
        ]);
      }

      const handleUpdateQty=(i, qty)=>{
        let curQty= parseInt(cart[i].qty)
        curQty += qty

        let subTotal= parseInt(curQty*cart[i].sPrice - cart[i].discount*curQty)
        var curCart =cart
        curCart[i].qty=curQty
        curCart[i].subTotal= subTotal
        changeCart ([...curCart])

    }

    const updatingSale =(orders)=>{

      let newOrders =[]
      orders.forEach(item => {
        newOrders.push({...item, sPrice:item.price, subTotal:item.price*item.qty, discount:item.unitDisc})
      });

      changeCart(newOrders)
     }
     const reloadSuspended =(orders)=>{

      let newOrders =[]
      orders.forEach(item => {
        newOrders.push({...item})
      });

      changeCart(newOrders)
     }

    const handleResetCart= ()=>{
      changeCart([])
    }
      return [cart, addtoCart, deleteFromCart, handleUpdateQty, handleResetCart, updatingSale, reloadSuspended]
}


////

export const useItemCartPurchase=(input=[])=>{
  const [cart, changeCart] = useState(input)

  const addtoCart= (item)=>{
      
      const index = cart.findIndex(cartItem=>{
        return cartItem.itemName ===item.itemName
      })

      var itemPrice, itemqty, itemdisc
        if(index>=0)
        {
            itemPrice = item.pPrice 
            itemqty =  parseInt(item.qty)+ parseInt(cart[index].qty)
            itemdisc = parseInt(item.discount)
            if(itemdisc>0 && itemdisc<100)
            {
              itemPrice = Math.round(itemPrice- itemdisc*itemPrice/100)
            }
  
            var newCart = cart
            newCart[index].qty = itemqty
            newCart[index].price = itemPrice
            changeCart(newCart)
          }
        else{
          itemPrice = item.pPrice
          itemqty = item.qty
          itemdisc = parseInt(item.discount)
          if(itemdisc>0 && itemdisc<100)
          {
            itemPrice = Math.round(itemPrice- itemdisc*itemPrice/100)
          }
          var newItem = {_id:item._id, price:itemPrice, qty:item.qty, itemName:item.itemName}
            changeCart([...cart, newItem])
        }

  }
  const deleteFromCart=(i)=>{
      changeCart([
        ...cart.slice(0, i),
        ...cart.slice(i + 1, cart.length)
      ]);
    }

    const handleUpdateQty=(i, qty)=>{
      let curQty= parseInt(cart[i].qty)
      curQty += qty

      var curCart =cart
      curCart[i].qty=curQty
      changeCart ([...curCart])

  }

  const updatingSale =(orders)=>{

    let newOrders =[]
    orders.forEach(item => {
      newOrders.push({...item, sPrice:item.price, subTotal:item.price*item.qty, discount:item.unitDisc})
    });

    changeCart(newOrders)
   }

  const handleResetCart= ()=>{
    changeCart([])
  }

  const reloadSuspended =(orders)=>{

    let newOrders =[]
    orders.forEach(item => {
      newOrders.push({...item})
    });

    changeCart(newOrders)
   }

    return [cart, addtoCart, deleteFromCart, handleUpdateQty, handleResetCart, updatingSale, reloadSuspended]
}

export const useTextboxVal = (input='')=>{
    const [text, setText] = useState(input)

    const handleChange =(e)=>{
      setText(e.target.value)
    }

    const handleReset =()=>{
      setText('')
    }

    return [text, handleChange, handleReset ]

}

export const useToggle= (input=false)=>{
  const [toggle, setToggle] = useState(input)

  const handleToggle = (val)=>{
    if(typeof val!=='boolean')
        setToggle(toggle=!toggle)
    else
      setToggle(val)
  }

  return [toggle, handleToggle]
}



export const itemReducer = (state, action)=>{
  switch(action.type){
    case 'CHANGEVAL':{
      const e = action.payload.target
      
      return {...state, [e.name]:e.value}
    }
    case 'CHANGEVALINT':{
      const e = action.payload.target
      const re = /^[0-9\b,-]+$/;
      if ((e.value === '' || re.test(e.value)) ) {
          return {...state,[e.name]:e.value}  
      }
      else
          return{...state}
      }
    case 'TOGGLESTOCK':{
      const e = action.payload.target
      return {...state, [e.name]:e.checked}
    }
    case 'UPDATE':{
      const item=action.payload
      const updateItem= { itemName:item.itemName, pPrice:item.pPrice, sPrice:item.sPrice, 
        stockOut:item.stockOut, type:item.type, model:item.model, desc:item.desc, vendor:item.vendor,
         itemAddedBy:item.itemAddedBy , qty:item.qty, itemID:item.itemID
         }

      return {...updateItem}
    }
    case 'UPDATEDATA':{
      const data = action.payload

      return {...data}
    }
    case 'RESET':
        return action.payload
    default :
    return {...state}
  }
}

export const itemStatusReducer = (state, action)=>{
  switch(action.type){
    case 'SAVE': {
      return {...state, disabled:false, status:'SAVE'}
    }
    case 'CANCEL': {
      return {disabled:true, status:'SAVE'}
    }
    case 'UPDATE':{
      return {disabled:false, status:'UPDATE'}
    }

    case 'RESET':{
      return {...state, disabled:true, status:'SAVE'}
    }
    default:{
      return {...state}
    }
  }
}

export const alertReducer =(state, action)=>{
  switch(action.type){
    case 'SAVESUCCESS':{
          return {message:'Record Saved', isOpen:true, msgColor:'success'}
    }

    case 'UPDATESUCCESS':{
      return {message:'Record Updated', isOpen:true, msgColor:'success'}
    }
    case 'FAILED':{
      return {message:'Something Went Wrong!!', isOpen:true, msgColor:'error'}
    }
    case 'DELETESUCCESS':{
      return {message:'Record Deleted!', isOpen:true, msgColor:'warning'}
    }

    case 'CLOSEMSG':{
      return {...state, isOpen:false}
  }

    case 'OTHER':{
          return {message:action.message, isOpen:true, msgColor:action.msgColor}
    }

  default :{
    return {...state, isOpen:false}
  }
  }
}

export const dialogReducer =(state, action)=>{
  switch(action.type){
    case 'UPDATE':{
          return {message:'Confirm to Update', isOpen:true, msgColor:'warning', status:'update'}
    }

    case 'DELETE':{
      return {message:'Confirm to Delete', isOpen:true, msgColor:'error', status:'delete'}
    }

    case 'OTHER':{
      return {message:action.message, isOpen:true, status:action.status}
    }

    case 'DELETESALE':{
      return {message:action.message, isOpen:true, status:action.status}
  }
    case 'CLOSEMSG':{
      return {...state, isOpen:false}
  }

  default :{
    return {...state, isOpen:false}
  }
  }
}

export const grandTotalReducer = (state, action)=>{
  switch(action.type){
    case 'CALC':{
      const items = action.items
      const saleEditing=action.saleEditing
      const saleRec= action.saleRec 
      let recDisc = 0

        var gTotal=0, unitDiscount=0, subTotal=0, furtherDisc =(action.furtherDisc && /\d/.test(action.furtherDisc)) ? action.furtherDisc : 0

        for(let i=0; i<items.length;i++)
        {
          if(/\d/.test(items[i].subTotal))
          {
            gTotal+=items[i].subTotal
            unitDiscount+=items[i].discount*items[i].qty
            subTotal+=items[i].sPrice*items[i].qty
          }
          
        }
        let finalFurtherDisc = state.furtherDisc+furtherDisc
        gTotal = subTotal-finalFurtherDisc-unitDiscount

        if(saleRec && saleRec.orders && saleRec.discount>0)
        {
          for (let i in saleRec.orders)
          {
            recDisc += saleRec.orders[i].unitDisc*saleRec.orders[i].qty
          }
        }
     
      if((!saleEditing || !saleRec || saleRec.discount===recDisc || saleRec.gTotal<gTotal) && items.length)    
       {
        return {grandTotal:gTotal, unitDiscount:unitDiscount, subTotal:subTotal, gst:state.gst, furtherDisc:finalFurtherDisc, change:0}
       }
      else if(!items.length)
      {
        unitDiscount=0, finalFurtherDisc=0, subTotal=0, gTotal=0
        return {grandTotal:gTotal, unitDiscount:unitDiscount, subTotal:subTotal, gst:state.gst, furtherDisc:finalFurtherDisc, change:0}
      }
      else
      {
        recDisc  = saleRec.discount-recDisc
        let itemsChanged = []

      loop2:  for (let j in saleRec.orders)
        {
          let found =false
          for(let i in items)
          {
           if(saleRec.orders[j]._id === items[i]._id )
           {
            found =true
            if(saleRec.orders[j].qty>items[i].qty)
            {
              
              const percentage = ((saleRec.orders[j].qty*saleRec.orders[j].price - saleRec.orders[j].unitDisc*saleRec.orders[j].qty) - (items[i].qty *items[i].price-items[i].unitDisc*items[i].qty) ) * 100 / saleRec.gTotal

              itemsChanged.push({_id:saleRec.orders[j]._id, name:saleRec.orders[j].itemName,  qtyChanged: saleRec.orders[j].qty-items[i].qty, percentage})
              break loop2
            }
           }
          }
          if(!found)
          {
            const percentage = (saleRec.orders[j].qty * saleRec.orders[j].price - saleRec.orders[j].unitDisc*saleRec.orders[j].qty) * 100 / saleRec.gTotal
            itemsChanged.push({_id:saleRec.orders[j]._id,  name:saleRec.orders[j].itemName, qtyChanged: saleRec.orders[j].qty, percentage})
          }
        }
        let remainingDisc=0
        for(let i in itemsChanged)
        {
          remainingDisc += itemsChanged[i].percentage*recDisc/100
        }
        if(remainingDisc>recDisc)
            remainingDisc=recDisc
          else
            remainingDisc= recDisc-remainingDisc

            remainingDisc = Math.round(remainingDisc)
            finalFurtherDisc=remainingDisc
            gTotal = subTotal-finalFurtherDisc-unitDiscount
            return {grandTotal:gTotal, unitDiscount:unitDiscount, subTotal:subTotal,gst:saleRec.gst, furtherDisc:finalFurtherDisc, change:0}
      }  
    }

    case 'CALCFURTHER':{
      const items = action.items
      var unitDiscount=0, subTotal=0, fullDiscount=action.discount
      var gst = action.gst ? action.gst : 0
      for(let i=0; i<items.length;i++)
      {
          unitDiscount+=items[i].unitDisc*items[i].qty
          subTotal+=items[i].price*items[i].qty
      }

      let furtherDisc = fullDiscount-unitDiscount
      gTotal = subTotal-unitDiscount-furtherDisc

       return {...state, furtherDisc:furtherDisc, gTotal:gTotal, unitDiscount:unitDiscount ,gst:gst, change:0}
    }

    case 'CALCSUSPEND':{
      const items = action.items
      var gst = action.gst ? action.gst : 0
      var unitDiscount=action.unitDisc, subTotal=0, furtherDisc=action.furtherDisc
      for(let i=0; i<items.length;i++)
      {
          subTotal+=items[i].sPrice*items[i].qty
      }
      let gTotal= subTotal-unitDiscount-furtherDisc

       return {...state, furtherDisc:0, gTotal:gTotal,gst:gst, unitDiscount:unitDiscount, change:0}
    }

    case 'CALCPURCHASE':{
      const items= action.items
      var gTotal=0, subTotal=0

      for(let i=0; i<items.length;i++)
      {
          
          gTotal+=items[i].qty*items[i].price
          subTotal+=items[i].qty*items[i].price
      }
      return {subTotal, gTotal, change:0}
    }

    case 'CHANGE':{
      let money = action.money
      if(!isNaN(money))
      {
        money =money-state.grandTotal
  
        return{...state, change:money}
      }
      else
      return{...state, change:0}
    }

    case 'ADDGST':{
      let gst = action.gst
      
      if(!isNaN(gst))
      {
        return{...state, gst:gst }
      }
      else
      return{...state, change:0}
    }

    case 'RESET':{
      return {subTotal:0, furtherDisc:0, grandTotal:0, unitDiscount:0, change:0, gst:0}
    }
    default:{
      return {...state}
    }
  }
  
}

export const loadingReducer = (state, action)=>{
  switch(action.type)
  {
    case 'CHECKOUTSTART':{
      return {...state, Checkout:true}
    }
    case 'CHECKOUTEND':{
      return {...state, Checkout:false}
    }
    case 'DELETESTART':{
      return {...state, Delete:true}
    }
    case 'DELETEEND':{
      return {...state, Delete:false}
    }
    case 'SEARCHSTART':{
      return {...state, Search:true}
    }
    case 'SEARCHEND':{
      return {...state, Search:false}
    }
    case 'SAVESTART':{
      return {...state, Save:true}
    }
    case 'SAVEEND':{
      return {...state, Save:false}
    }
    case 'TOGGLE':{
      let data = {...action}
      delete data.type
      const objName = Object.keys(data)[0]
      return {...state, [objName]: data[objName] }
    }
    default:{
      return {...state}
    }
  }
}

export const dashboardReducer = (state, action)=>{
  switch(action.type)
  {
    case 'SALEVPROFIT':{
      const data=action.data
      // purhcase:{name:'Purchase', data:data.purchaseAmount},
      return {...state, Barchart:{sale:{name:'Sales', data:data.saleAmount},  profit:{name:'Profit', data:data.profit}, cashReceived:{name:'CashReceived', data:data.cashReceived},  dates:data.dates}}
    }

    case 'MONTHLYSALES':{
      const data=action.data
      // 
      return {...state, LineChart:{sale:{name:'Sales', data:data.saleAmount}, profit:{name:'Profit', data:data.profit},  purhcase:{name:'Purchase', data:data.purchaseAmount}, dates:data.dates}}
    }
    case 'ITEMMOSTSELL':{
      const data=action.data
      return {...state, DoughnutChart:{itemName:{name:'ItemName', data:data.itemNames}, count:{name:'No of Orders', data:data.orderFreq}}}
    }

    case 'ITEMRETURN':{
      const data=action.data
      return {...state, PieChart:{itemName:{name:'ItemName', data:data.returnItems}, count:{name:'No of Orders', data:data.returnFreq}}}
    }

    case 'MONTHLYPURCHASE':{
      const data= action.data
      return {...state, PurchaseCart:{Purchase:{name:'Purchases', data:data.gTotal}, dates:data.dates}}
    }
    case 'SALES':{

      const data =action.data
      return {...state, ...data}
    }

    case 'STORAGE':{
      let data = action.data
      if(data.recentSales)
      {
        for (let i=0;i<data.recentSales.length;i++)
        {
          data.recentSales[i].createdAt = new Date(data.recentSales[i].createdAt)
          data.recentSales[i].updatedAt = new Date(data.recentSales[i].updatedAt)
        }
      }

      if(data.recentPurchases)
      {
        for (let i=0;i<data.recentPurchases.length;i++)
        {
          data.recentPurchases[i].createdAt = new Date(data.recentPurchases[i].createdAt)
          data.recentPurchases[i].updatedAt = new Date(data.recentPurchases[i].updatedAt)
        }
      }
      
      return {...data}
    }
    case 'ADDPENDING':{
      const amount = action.data
      const objName = Object.keys(amount)[0]
      amount[objName]+=state[objName]
      return {...state, [objName]:amount[objName]}
    }

    default:{
      return {...state}
    }
  }
}

export const customerReducer = (state, action)=>{
  switch(action.type){
    case 'CHANGEVAL':{
      const e = action.payload.target
      
      return {...state, [e.name]:e.value}
    }
    case 'CHANGEVALINT':{
      const e = action.payload.target
      const re = /^[0-9\b]+$/;
      if (e.value === '' ) {
          return {...state,[e.name]:e.value}
      }
      else if ( re.test(e.value))
      {
        return {...state,[e.name]:parseInt(e.value)}
      }
      else
          return{...state}
      }
    case 'TOGGLESTOCK':{
      const e = action.payload.target
      return {...state, [e.name]:e.checked}
    }
    case 'UPDATE':{
      const customer=action.payload
      return {...customer}
    }
    case 'RESETSINGLE':{
      let  e = action.payload
      return {...state,[e]:''}
    }
    case 'TABLERIGHTS':{
      let values = action.val
      
      return {...state, rights:values}
    }

    case 'UPDATEUSER':{
      let updatingUser=action.payload
      let curRights = state.rights

      if(!updatingUser.rights || !updatingUser.rights.length)
        updatingUser.rights=updatingUser.rights=curRights
      else
      {
        let usersRight= updatingUser.rights
        for (let i in usersRight)
        {
          for(let j in usersRight[i].rows)
            {
              if(!usersRight[i].rows[j].name && usersRight[i].rows[j].access===true)
              {
                for (let k in curRights)
                {
                  for (let l in curRights[k].rows)
                  {
                    if(!curRights[k].rows[l].name && curRights[k].rows[l].options === usersRight[i].rows[j].options && usersRight[i].rows[j].access)
                    {
                      curRights[k].rows[l].access = true
                    }
                  }
                }
              }
              else
              {

                  for (let k in curRights)
                  {
                    for (let l in curRights[k].rows)
                    {
                      if(curRights[k].rows[l].name && usersRight[i].rows[j].name && curRights[k].rows[l].name === usersRight[i].rows[j].name)
                      { 
                        for (let m in curRights[k].rows[l].options)
                                  {
                                    for (let n in usersRight[i].rows[j].options)
                                    {
                                      if(usersRight[i].rows[j].options[n].access && curRights[k].rows[l].options[m].name === usersRight[i].rows[j].options[n].name)
                                      curRights[k].rows[l].options[m].access=true
                                    }
                                  }
                      }
                    } 
                  }
                
     
              }
            }

        }
      }

      return {...updatingUser, rights:curRights}
    }

    case 'CHANGECHECK':{
      let rightIndex= action.rightIndex, rightRowIndex=action.rightRowIndex, rowOptionIndex=action.rowOptionIndex
     let rights = state.rights
      if(rowOptionIndex !==undefined && rowOptionIndex!==null)
      {
        rights[rightIndex].rows[rightRowIndex].options[rowOptionIndex].access=  !rights[rightIndex].rows[rightRowIndex].options[rowOptionIndex].access
      }
      else
        {
          rights[rightIndex].rows[rightRowIndex].access = !rights[rightIndex].rows[rightRowIndex].access 
        }




      return {...state, rights}
    }
    case 'RESET':
        return action.payload
    default :
    return {...state}
  }
}

export const supplierReducer = (state, action)=>{
  switch(action.type){
    case 'CHANGEVAL':{
      const e = action.payload.target
      
      return {...state, [e.name]:e.value}
    }
    case 'CHANGEVALINT':{
      const e = action.payload.target
      const re = /^[0-9\b]+$/;
      if (e.value === '' ) {
          return {...state,[e.name]:e.value}
      }
      else if ( re.test(e.value))
      {
        return {...state,[e.name]:parseInt(e.value)}
      }
      else
          return{...state}
      }

    case 'TOGGLESTOCK':{
      const e = action.payload.target
      return {...state, [e.name]:e.checked}
    }
    case 'UPDATE':{
      const supplier=action.payload

      return {...supplier}
    }

    case 'RESETSINGLE':{
      let  e = action.payload
      return {...state,[e]:''}
    }
    case 'RESET':
        return action.payload
    default :
    return {...state}
  }
}



export const useItemReturnCart=(input=[])=>{
    const [cart, changeCart] = useState(input)

    const addtoCart= (item)=>{
        
        const index = cart.findIndex(cartItem=>{
          return cartItem.itemName ===item.itemName
        })

        var itemPrice, itemqty, subTotal
          if(index>=0)
          {
              itemPrice = item.sPrice 
              itemqty =  parseInt(item.qty)+ parseInt(cart[index].qty)
              subTotal = parseInt(itemPrice*itemqty)
              var newCart = cart
              newCart[index].qty = itemqty
              newCart[index].subTotal= subTotal
              newCart[index].sPrice = itemPrice
              changeCart(newCart)
            }
          else{
            itemPrice = item.sPrice
            itemqty = item.qty
            subTotal = parseInt(itemPrice*itemqty)
  
            var newItem = {...item, subTotal}
              changeCart([...cart, newItem])
          }
  
    }
    const deleteFromCart=(i)=>{
        changeCart([
          ...cart.slice(0, i),
          ...cart.slice(i + 1, cart.length)
        ]);
      }

      const handleUpdateQty=(i, qty)=>{
        let curQty= parseInt(cart[i].qty)
        curQty += qty

        let subTotal= parseInt(curQty*cart[i].sPrice)
        var curCart =cart
        curCart[i].qty=curQty
        curCart[i].subTotal= subTotal
        changeCart ([...curCart])

    }

    const reloadSuspended =(orders)=>{

      let newOrders =[]
      orders.forEach(item => {
        newOrders.push({...item})
      });

      changeCart(newOrders)
     }
    const handleResetCart= ()=>{
      changeCart([])
    }
      return [cart, addtoCart, deleteFromCart, handleUpdateQty, handleResetCart, reloadSuspended]
}


export const incomeReducer = (state, action)=>{
  switch(action.type){
    case 'SALES':{

        const sales= action.sales
        return {...state, sales:{title:`Sales of Month ${sales._id.month}/${sales._id.year}`, amount:sales.total }}
    }

    case 'PURCHASES':{
      const purchases= action.purchases
      return {...state, purchases:{title:`Purchases of Month ${purchases._id.month}/${purchases._id.year}`, amount:purchases.total }}
    }

    case 'PAYABLE':{
      return {...state, purchases:{title:action.title, amount:action.total }}
    }

    case 'RECEIVEABLE':{
      return {...state, sales:{title:action.title, amount:action.total }}
    }

    case 'OTHER':{
        const other =action.other
        let catArray =[]
        for (let i =0;i<other.length;i++)
        {
          catArray.push({cat:other[i]._id, titles:other[i].data, open:false})
        }
        return {...state, cat:catArray}
    }
    case 'CALC':{
     
      let sumAmount = 0
      let newArray= state.cat ? state.cat : []

      for(let i =0; i<newArray.length; i++)
      {
        for (let j=0;j<newArray[i].titles.length;j++)
        {
          sumAmount+=newArray[i].titles[j].amount
        }
      }
      if(state.sales && state.sales.amount)
          sumAmount += state.sales.amount
      else if(state.purchases && state.purchases.amount)
          sumAmount += state.purchases.amount

          
        return {...state, total:sumAmount}
    }
    case 'TOGGLEOPEN':{
    
      const index = action.index

      let newArray= state.cat
        newArray[index].open= !newArray[index].open

        return {...state}
    }

    case 'STORAGE':{
      const data = action.data
        return {...data}
    }
    case 'RESET':{
      return {sales:null, cat:null}
    }
    default :
    return {...state}
  }
}

export  function signinReducer (state, action){
  switch(action.type){
      case 'ERROR':
          return {message:'Username / Password Error', color:'error'}
      case 'SUSPENDED':
           return {message:'your account is SUSPENDED, Contact Admin', color:'error'}
      case 'BLOCKED':
          return {message:'your account was BLOCKED due to unsual activitiy, Contact Admin', color:'error'}
      case 'DELETED':
          return {message:'your account is DELETED, Contact Admin', color:'error'}
      case  'WARN':
          return {message:'Welcome Back: ' + action.username, color:'info'}
      case 'SUCCESS':
          return {message:'Welcome: ' + action.username, color:'success'}
      case 'FAILED':
          return {message:'Internal ERROR while Signing in', color:'error'}
      default:
          return {message:'ERROR', color:'error'}
  }
}

const GetDate = (date)=>{
  let newDate
  if(!date)
    newDate = new Date()
  else
    newDate = new Date(date)
  newDate = `${newDate.getFullYear()}-${newDate.getMonth()+1}-${newDate.getDay()} ${newDate.getHours()}:${newDate.getMinutes()}:${newDate.getMinutes()}`
  return newDate.toString()
}

export const messageReducer =(state, action)=>{
  switch(action.type){
    case 'LOAD':
    {
      let users= action.users
      let usersArray=[]
      let totalUnread=0
      for(let i=0; i<users.length; i++)
      {
          usersArray.push({id:users[i].id, name:users[i].name, messages:users[i].messages, active:false, loginTime:null, unreadMsg:users[i].unreadMsg})
        if(users[i].unreadMsg>0)
        totalUnread +=users[i].unreadMsg
        }

      return {activeIndex:-1, users:usersArray, unreadMsg:totalUnread}
    }

    case 'DELETEMYUSER':{
      let name =action.name
      let newArray = state.users.filter(user=> user.name!==name)
      return {...state, users:newArray} 

    }

    case 'SETACTIVE':{

        const activeUser  = action.user
        let usersArray = [...state.users]
        const index = usersArray.findIndex(user=>user.name === activeUser.username)
        if(index>=0)
        {
          usersArray[index].active=true
          usersArray[index].onlineTime =new Date()
          usersArray[index].socket= activeUser.socket
         return {...state, users:usersArray} 
        }
    }

    case 'SENDOFFLINE':{
        const socket = action.socket
        let usersArray = state.users
       
        const index = usersArray.findIndex(user=>user.socket===socket)
        if(index>=0)
        {
          usersArray[index].socket=null
          usersArray[index].active=false
        }

        return {...state, users:usersArray}
    }

    case 'CHANGEUSER':
    {
      let id =action.id
      const index = state.users.findIndex(user=>user.id===id)
      if(index>=0)
      return{...state, activeIndex:index}
      else
        return{...state}
    }

    case 'SENDMESSAGE':{
        const message=action.message
        const msgID = action.msgID
        const index = state.activeIndex
        if(index>=0)
        {
          let users = [...state.users]
          users[index].messages.push({type:'SEND', message:message, status:'SENDING', msgID, dateTime:GetDate()})
          return {...state, users:users}
        }
        else
          return {...state}
       
    }

    case 'UPDATESTATUS':{
      const msgID=action.msgID
      const status= action.status
      const activeIndex = state.activeIndex
      let users= [...state.users]
      
      for (let i=0 ;i<users[activeIndex].messages.length;i++)
      {
        if(users[activeIndex].messages[i].msgID===msgID || (users[activeIndex].messages[i]._id && users[activeIndex].messages[i]._id === action._id))
        {
          users[activeIndex].messages[i].status=status
          if(action._id && action._id!==msgID)
          {
            users[activeIndex].messages[i]._id=action._id
          }
          
        }
      }
      return {...state, users:users}
     
     }

    case 'DELETEMSG':{
      const index=action.index
      const user =state.users[state.activeIndex]
      const messagesArray = user.messages.filter((message, i)=>i!==index)
      let users = [...state.users]
      users[state.activeIndex].messages=messagesArray
      return {...state, users:users}
     
  }

  case 'GETMESSAGE':{
    const message=action.data.message
    const sender =action.data.sender
    const msgID = action.data.msgID
    const usersArray = state.users
    const index = usersArray.findIndex(user=> user.name === sender)

    if(index>=0)
    {
      let msgFound=false
      for(let i=0; i<usersArray[index].messages.length;i++)
        {
          if(usersArray[index].messages[i].msgID===msgID)
            {
              msgFound=true
              break
            }
        }
        if(!msgFound)
         usersArray[index].messages.push({message:message, type:'RECEIVE', status:'SENT', msgID, dateTime:GetDate()})
    }

    return {...state, users:usersArray}
}


case 'GETONLINEMESSAGE':{

  const messageData= action.messageData
  const usersArray = state.users
  const index = usersArray.findIndex(user=> user.id === messageData.senderID )
  if(index>=0)
  {
    let msgFound=false
    for(let i=0; i<usersArray[index].messages.length;i++)
      {
        if(usersArray[index].messages[i].msgID===messageData._id)
          {
            msgFound=true
            break
          }
      }
      if(!msgFound)
       usersArray[index].messages.push({message:messageData.message, type:'RECEIVE', status:'SENT', msgID:messageData._id, dateTime:GetDate()})
  }

  return {...state, users:usersArray}
}


case 'OPENMESSAGE':{
  if(state.activeIndex>=0)
  {
    let usersArray = state.users
    let messageArray = usersArray[state.activeIndex].messages

    for(let i=0;i<messageArray.length;i++)
    {
      if(messageArray[i].type==='RECEIVE' && messageArray[i].status==='SENT' )
      {

        messageArray[i].status ='READ'
      }
      
    }

    usersArray[state.activeIndex].messages= messageArray

    return {...state, users:usersArray}
  }
  else
    return {...state}

}

case 'SETMSGSTATUS':{
  const msgID= action.msgID
  const status=action.status
  let usersArray =state.users
  let found =false
  for (let i=0;i<usersArray.length;i++)
  {
    for(let j=0;j<usersArray[i].messages.length;j++)
    {
      if(usersArray[i].messages[j].msgID === msgID || (usersArray[i].messages[j]._id && usersArray[i].messages[j]._id===msgID))
      {
        found = true 
        usersArray[i].messages[j].status=status
      }
        
    }
  }
  if(!found && action.message)
  {
    const msgData=action.message
    const index = usersArray.findIndex(user=>user.id===msgData.receiverID)
    if(index>=0)
    {
      usersArray[index].messages.push({type:'SEND', status:'READ', message:msgData.message, dateTime:GetDate(msgData.updatedAt), msgID:msgData._id, _id:msgData._id, })
    }
  }

  return {...state, users:usersArray}

}

case 'GETUNREADMSG':{
  let totalUnread=0
  let usersArray = state.users

  for (let i=0; i<usersArray.length;i++)
  {
    let usersUnread=0
    for(let j=0;j<usersArray[i].messages.length;j++)
    {
      if(usersArray[i].messages[j].type==='RECEIVE' && usersArray[i].messages[j].status==='SENT')
      {
        ++usersUnread
        ++totalUnread
      }
      
    }
    usersArray[i].unreadMsg=usersUnread
 }

if(state.unreadMsg!==totalUnread)
 return {...state, users:usersArray, unreadMsg:totalUnread}
else
 return {...state}

}

case 'CHECKCHATOPEN':{
  const sender =action.sender
  const msgID=action.msgID
  const socket= action.socket
  const receiverSocket= action.receiverSocket
  if (state.activeIndex>=0 && state.users[state.activeIndex].name===sender)
  {
    socket.emit('open_message', {mySocket:socket.id, msgID:msgID, sender:sender, socket:state.users[state.activeIndex].socket})
    let usersArray = state.users
    let messageArray = usersArray[state.activeIndex].messages

    for(let i=0;i<messageArray.length;i++)
    {
      if(messageArray[i].type==='RECEIVE' && messageArray[i].status==='SENT' )
      {
        messageArray[i].status ='READ'
      }
      
    }

    usersArray[state.activeIndex].messages= messageArray

    return {...state, users:usersArray}
  }
  else 
    {
      socket.emit('receive_message', {sender, msgID, socket:receiverSocket, mySocket:socket.id})
    }

  return {...state}

}

case 'GETTICKETMESSAGES':{

  const messageData= action.messages
  const usersArray = state.users
  if(usersArray.length)
      for (let i =0; i<messageData.length;i++)
      {
        usersArray[0].messages.push({message:messageData[i].message, type:'RECEIVE', status:'SENT', msgID:messageData[i]._id, dateTime:GetDate()})
      } 
  return {...state, users:usersArray}
}

case 'RESET':{
  const data= action.data
  return data
}
    default:
      return {...state}
  }
}