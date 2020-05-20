import React, {useState} from 'react'
import {Pagination, Dropdown } from 'react-bootstrap'
import range from 'js-range'
import styled from 'styled-components'
import { messages } from './cases.I18n'
import LocaleContext from '../../state/contexts/LocaleContext'
import { If } from '../../Utility/utility'

const Paginator = (arr, prPage = 10) => {
  const locale = React.useContext(LocaleContext);
  const { vis, linjer } = messages[locale]

  const [numberPrPage, setNumberPrPAge] = useState(prPage)
  const [active, setActive] = useState(1);

  const Paginate = ({ children }) => {
    const paginationFilter = (_, i) => 
      i >= active * numberPrPage - numberPrPage && 
      i < active * numberPrPage
    
    return arr
      .filter(paginationFilter)
      .map(children)
  }

  const PaginationNav = () => {
    const numberOfPages = Math.ceil(arr.length / numberPrPage) 
    let start = active - 2
    let end = active + 2
    end = end < 5 ? 5 : end
    
    return ( 
      numberOfPages > 1 &&
      <Pagination>
        <Pagination.First onClick={() => setActive(1)} />
        <Pagination.Prev 
          onClick={() => setActive(active - 1)} 
          disabled={active === 1} 
        />
        <If condition={active > 3}>
          <Pagination.Item onClick={resetPagination}>1</Pagination.Item>
          <Pagination.Ellipsis />
        </If>
        {range(numberOfPages)
          .map((_, i) => {
            const count = i + 1
            if(count > end || count < start) return null
            return (
              <Pagination.Item 
                key={i} 
                onClick={() => setActive(count)} 
                active={count === active}
              >
                {count}
              </Pagination.Item>
            )
        })}
        <If condition={active < numberOfPages - 2}>
          <Pagination.Ellipsis />
          <Pagination.Item onClick={() => setActive(numberOfPages)}>{numberOfPages}</Pagination.Item>
        </If>        
        <Pagination.Next 
          onClick={() => setActive(active + 1)} 
          disabled={active === numberOfPages} 
        />
        <Pagination.Last onClick={() => setActive(numberOfPages)} />
      </Pagination>
    )
  }

  const PaginationDropdown = () => { 
    const lines = [5, 10, 20, 40, 100]
    return (
      <span>  
        {vis}
        <StyledDropdown>
          <Dropdown.Toggle size="sm" variant="secondary">
            {numberPrPage}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {lines.map(line => 
              <Dropdown.Item 
                key={line}
                onClick={() => {
                  setNumberPrPAge(line)
                  resetPagination()
                }}
              >
                {line}
              </Dropdown.Item>
            )}
          </Dropdown.Menu>
        </StyledDropdown> 
        {linjer}
      </span>
    )
  }

  const StyledDropdown = styled(Dropdown)`
    display: inline-block;
    margin: 10px;
  `

  const PaginationIndex = () => {
    const start = active * numberPrPage - numberPrPage + 1
    const end = active * numberPrPage
    const total = arr.length 
    return `Viser ${start} til ${end > total ? total : end} av ${total} linjer`
  }

  const resetPagination = () => setActive(1)

  return [Paginate, PaginationNav, PaginationDropdown, PaginationIndex, resetPagination]
}
 
export default Paginator
  
  
