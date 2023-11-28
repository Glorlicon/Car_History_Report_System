import React from 'react';
import { Paging } from '../../utils/Interfaces';
import '../../styles/Paging.css'

const PagingComponent: React.FC<Paging> = ({
    CurrentPage,
    TotalPages,
    PageSize,
    TotalCount,
    HasPrevious,
    HasNext
}) => {
    const getPages = () => {
        console.log(CurrentPage)
        console.log(TotalPages)
        let pages: (number | string)[] = []
        pages.push(1)
        if (TotalPages <= 1) return pages
        if (CurrentPage - 1 >= 3) {
            pages.push('...')
        }
        if (CurrentPage - 1 != 1 && CurrentPage - 1 != 0) pages.push(CurrentPage - 1)
        if (CurrentPage != TotalPages && CurrentPage != 1) pages.push(CurrentPage)
        if (CurrentPage + 1 < TotalPages) pages.push(CurrentPage + 1)
        if (TotalPages - CurrentPage >= 3) {
            pages.push('...')
        }
        pages.push(TotalPages)
        return pages
    }
  return (
      <div className="paging-container">
          {HasPrevious && CurrentPage != 1 && <button onClick={() => console.log("Go to previous page")}>&lt;</button>}
          {getPages().map((page, index) => (
              <button
                  key={index}
                  disabled={page === CurrentPage || page === '...'}
                  onClick={() => {console.log("Come here",page) }}
              >{page}</button>
          ))}
          {HasNext && CurrentPage != TotalPages && <button onClick={() => console.log("Go to next page")}>&gt;</button>}
      </div>
  );
}

export default PagingComponent;