

const follow = (params, credentials, followId) => {
    return fetch('/employees/follow/', {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        // ,
        // 'Authorization': 'Bearer ' + credentials.t
      },
      body: JSON.stringify({employeeId:params.employeeId, followId: followId})
    }).then((response) => {
      return response.json()
    }).catch((err) => {
      console.log(err)
    }) 
  }




  const unfollow = (params, credentials, unfollowId) => {
    return fetch('/employees/unfollow/', {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json' //,
        // 'Authorization': 'Bearer ' + credentials.t
      },
      body: JSON.stringify({employeeId:params.employeeId, unfollowId: unfollowId})
    }).then((response) => {
      return response.json()
    }).catch((err) => {
      console.log(err)
    })
  }


  export {
      follow,
      unfollow
  }