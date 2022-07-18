import { useState, useCallback, useEffect, useRef } from "react";
import "./style.css";
import TableContent from "./TableContent";

const createHeaders = (headers) => {
  return headers.map((item) => ({
    text: item,
    ref: useRef()
  }));
};

const Table = ({ headers, minCellWidth, history, width, refresh, maxHeight }) => {

  const [tableHeight, setTableHeight] = useState("auto");
  const [activeIndex, setActiveIndex] = useState(null);
  const tableElement = useRef(null);
  const columns = createHeaders(headers);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  history?.sort((a,b) => {
    return new Date(b.date) - new Date(a.date);
  });

  useEffect(() => {
    setTableHeight(tableElement.current.offsetHeight);
  }, []);

  const mouseDown = (index) => {
    setActiveIndex(index);
  };

  const mouseMove = useCallback(
    (e) => {
      const gridColumns = columns.map((col, i) => {
        if (i === activeIndex) {
          const width = e.clientX - col.ref.current.offsetLeft;

          if (width >= minCellWidth) {
            return `${width}px`;
          }
        }
        return `${col.ref.current.offsetWidth}px`;
      });

      tableElement.current.style.gridTemplateColumns = `${gridColumns.join(
        " "
      )}`;
    },
    [activeIndex, columns, minCellWidth]
  );

  const removeListeners = useCallback(() => {
    window.removeEventListener("mousemove", mouseMove);
    window.removeEventListener("mouseup", removeListeners);
  }, [mouseMove]);

  const mouseUp = useCallback(() => {
    setActiveIndex(null);
    removeListeners();
  }, [setActiveIndex, removeListeners]);

  useEffect(() => {
    if (activeIndex !== null) {
      window.addEventListener("mousemove", mouseMove);
      window.addEventListener("mouseup", mouseUp);
    }

    return () => {
      removeListeners();
    };
  }, [activeIndex, mouseMove, mouseUp, removeListeners]);

  const styles = {
	History : {
		fontSize : "1.6rem",
		fontFamily : "font-bold",
    display : "flex",
    alignItems : "flex-start",
	},
	OptionsWrapper : {
		display : "flex",
		justifyContent : "flex-end",
		alignItems : "center",
		gap : "2rem",
		height : "4vh",
	},
	Interactable : {
		borderBottom : "0.1rem solid var(--clr-white-darker)",
		padding : "0 max(1vh, 1vw)",
		height : "100%",
    display : "flex",
    alignItems : "center",
    gap : "0.5rem",
	},
	HR : {
		height : "100%",
		width : "1px",
		backgroundColor : "var(--clr-white-border)",
	},
  Refresh : {
    fontSize : "2rem",
    cursor : "pointer",
    marginLeft : "0.4px",
  }
  }

  useState(() => {
	let maxPage = Math.ceil(history?.length / itemsPerPage)
	if(currentPage > maxPage) {
		console.log(itemsPerPage)
		setCurrentPage(maxPage);
	}
  }, [itemsPerPage])

  return (
    <div style = {{marginLeft : "auto"}}>
		<p style = {styles.History} >Transaction History <ion-icon onClick = {refresh} style = {styles.Refresh} name="refresh-circle-outline" /></p>
		<table className="tx-table" ref={tableElement} style = {{width, maxHeight}} >
			<thead>
				<tr>
					{columns.map(({ ref, text }, i) => (
						<th ref={ref} key={text}>
							<span style = {{textAlign : text == "Amount" || text == "Date" ? "right" : "left"}}>{text}</span>
							<div
								style={{ height: tableHeight }}
								onMouseDown={() => mouseDown(i)}
								className={`resize-handle ${
								activeIndex === i ? "active" : "idle"
								}`}
							/>
						</th>
					))}
				</tr>
			</thead>
			<TableContent history = {history?.slice(currentPage*itemsPerPage, (currentPage+1)*itemsPerPage)} />
		</table>
		<div style = {styles.OptionsWrapper} >
			<p style = {{fontSize : "1.5rem"}}>Items per page:</p>
			<input min = {1} max = {history?.length} style = {{...styles.Interactable, width : "10ch", backgroundColor : "var(--clr-white-fill)", borderBottom : "1px solid var(--clr-white-dark)"}} value = {itemsPerPage} onChange = {(e) => {setItemsPerPage(e.target.value)}} type = "number" />	
			<div style = {styles.HR} ></div>
			<button data-attribute="table-btn" style = {{...styles.Interactable, cursor : "pointer"}} disabled = {currentPage === 0 ? true : false} onClick = {() => {setCurrentPage(prev => prev - 1)}} >← Prev</button>	
			<p style = {{...styles.Interactable, fontSize : "1.5rem", backgroundColor : "var(--clr-white-fill)", borderBottom : "1px solid var(--clr-white-dark)", display : "grid", placeItems : "center"}} >{currentPage + 1}</p>
			<p style = {{fontSize : "1.5rem",}} >of {Math.ceil(history?.length / itemsPerPage)}</p>
			<button data-attribute="table-btn" style = {{...styles.Interactable, cursor : "pointer"}} disabled = {currentPage + 1 === Math.ceil(history?.length / itemsPerPage) ? true : false} onClick = {() => {setCurrentPage(prev => prev + 1)}} >Next →</button>
		</div>
    </div>
  );
};

export default Table;
