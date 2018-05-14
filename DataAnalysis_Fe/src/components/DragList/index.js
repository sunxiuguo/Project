// import { List } from 'antd';
import React ,{ PureComponent } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { connect } from 'dva';
// import styles from './index.less';

const grid = 8;
// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: grid * 2,
  margin: `0 ${grid}px 0 0`,

  // change background colour if dragging
  background: isDragging ? '#a7d6fa' : '#f0f2f5',

  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? '#f0f2f5' : '#f0f2f5',
  display: 'flex',
  // padding: grid,
  padding:0,
  overflow: 'auto',
});

const renderList = (data,key) =>{
  // eslint-disable-next-line
  return data.map((item,index) => <li key={`${key}-${item}-${index}`} style={{marginBottom:5}}>{item}</li>)
};

@connect(({url}) => ({
  url,
}))
export default class DragList extends PureComponent {

  constructor(props){
    super(props);
    this.state={
      items:[],
    }
  }

  componentDidMount(){
    // const { dispatch } = this.props;
    // dispatch({
    //   type:'url/getCheckedColsOrder',
    // })
  }

  componentWillReceiveProps(nextProps){
    if(JSON.stringify(nextProps.data) === JSON.stringify(this.props.data))
      return;
    this.setState({
      items:nextProps.data,
    })
  }



  onDragEnd = result => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(
      this.state.items,
      result.source.index,
      result.destination.index
    );
    console.log(JSON.stringify(items))
    this.setState({
      items,
    });
  }



  render(){
    // const { data } = this.props;
    // const [key,...listData] = data;
    // const count = data.length;
    // console.log(JSON.stringify(this.state.items))
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId="droppable" direction="horizontal">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
              {...provided.droppableProps}
            >
              {this.state.items.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(Itemprovided, Itemsnapshot) => (
                    <div
                      ref={Itemprovided.innerRef}
                      {...Itemprovided.draggableProps}
                      {...Itemprovided.dragHandleProps}
                      style={getItemStyle(
                        Itemsnapshot.isDragging,
                        Itemprovided.draggableProps.style
                      )}
                    >
                      <ul style={{listStyleType:"none"}}>
                        {renderList(item.content,item.id)}
                      </ul>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  }
}
