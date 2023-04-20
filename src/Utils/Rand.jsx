export const GetAccess =(userType, rights, header, header2, option)=>{

  if(userType==='Developer')
  {
    return true
  }
   else if(header2)
    {
      let found=false
      for (let i in rights)
      {
        if(rights[i].header===header)
        {
          for (let j in rights[i].rows)
          {
            if(rights[i].rows[j].name.toLowerCase()===header2.toLowerCase())
            {
              const right = rights[i].rows[j].options.find(optionName=>optionName.name.toLowerCase()===option.toLowerCase())
              found = true
              if (right && right.name)
                return right.access
              else
                return false
            }
          }
        }
      }
      if(!found)
        {
          return false
        }
  
  
          return null
    }
    if(header && !header2)
    {
      let found=false
      for (let i in rights)
      {
        if(rights[i].header.toLowerCase()===header.toLowerCase())
        {
          const right = rights[i].rows.find(optionName=>optionName.options.toLowerCase()===option.toLowerCase())
          found= true
          if(right && right.options)
          return right.access
          else 
            return false
        }
      }
      if (!found)
        return false
    }
    else
      return null
  
  }