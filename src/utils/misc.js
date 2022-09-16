const formatDate = date =>
  new Intl.DateTimeFormat('en-DE', {day: 'numeric', month: 'long', year: 'numeric'}).format(
    date,
  )

export {formatDate}