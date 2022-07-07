import { useState, useCallback, useEffect, useRef } from "react";
import "./style.css";
import TableContent from "./TableContent";

const createHeaders = (headers) => {
  return headers.map((item) => ({
    text: item,
    ref: useRef()
  }));
};

const Table = ({ headers, minCellWidth, history, maxWidth, refresh, maxHeight, txuri, adduri }) => {
  const [tableHeight, setTableHeight] = useState("auto");
  const [activeIndex, setActiveIndex] = useState(null);
  const tableElement = useRef(null);
  const columns = createHeaders(headers);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  history.sort((a,b) => {
    return new Date(b.date) > new Date(a.date);
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
		fontSize : "1.5rem",
		fontWeight : "600",
    display : "flex",
    alignItems : "flex-start",
	},
	OptionsWrapper : {
		display : "flex",
		justifyContent : "flex-end",
		alignItems : "center",
		gap : "1rem",
		height : "5vh",
	},
	Interactable : {
		backgroundColor : "var(--clr-white-dark)",
		borderBottom : "0.1rem solid var(--clr-white-darker)",
		padding : "0 max(1vh, 1vw)",
		height : "100%",
    display : "flex",
    alignItems : "center",
    gap : "0.5rem"
	},
	HR : {
		height : "100%",
		width : "1px",
		backgroundColor : "var(--clr-white-dark)",
	},
  Refresh : {
    fontSize : "2rem",
    cursor : "pointer",
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
    <div>
		<p style = {styles.History} >Transaction History <ion-icon onClick = {refresh} style = {styles.Refresh} name="refresh-circle-outline" /></p>
        <table className="tx-table" ref={tableElement} style = {{maxWidth, maxHeight}} >
			<thead>
				<tr>
					{columns.map(({ ref, text }, i) => (
						<th ref={ref} key={text}>
							<span>{text}</span>
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
			<TableContent history = {history?.slice(currentPage*itemsPerPage, (currentPage+1)*itemsPerPage)} txuri = {txuri} adduri = {adduri} />
        </table>
		<div style = {styles.OptionsWrapper} >
			<p>Items per page</p>
			<input min = {1} max = {history?.length} style = {{...styles.Interactable, width : "10ch"}} value = {itemsPerPage} onChange = {(e) => {setItemsPerPage(e.target.value)}} type = "number" />	
			<div style = {styles.HR} ></div>	
			<button style = {{...styles.Interactable, cursor : "pointer"}} disabled = {currentPage === 0 ? true : false} onClick = {() => {setCurrentPage(prev => prev - 1)}} ><ion-icon name="arrow-back-outline"></ion-icon>Prev</button>	
			<p style = {styles.Interactable} >{currentPage + 1}</p>
			<p>of {Math.ceil(history?.length / itemsPerPage)}</p>
			<button style = {{...styles.Interactable, cursor : "pointer"}} disabled = {currentPage + 1 === Math.ceil(history?.length / itemsPerPage) ? true : false} onClick = {() => {setCurrentPage(prev => prev + 1)}} >Next<ion-icon name="arrow-forward-outline"></ion-icon></button>
		</div>
    </div>
  );
};

export default Table;
