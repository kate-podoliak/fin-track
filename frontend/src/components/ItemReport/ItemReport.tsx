import React, { useEffect, useState } from "react";
import styles from "./itemReport.module.scss";
import { formatAmount } from "@/utils/formatAmount";

interface Transaction {
  id: number;
  amount: number;
  createdAt: string;
  description: string;
}

interface ItemProps {
  title: string;
  subtitle?: string;
  amount: string;
  type: string;
  color?: string;
  categoryId: number;
  isCategory: boolean;
  onDelete: (id: number) => void;
  transactions: Transaction[];
  description?: string
  onUpdate?: (id: number, newName: string) => void;
  onUpdateTransaction?: (transactionId: number, updatedTransaction: Transaction) => void;
  onUpdateNewTransaction?: (newDescription: string, newAmount: number) => void;
  onDeleteTransaction?: (transactionId: number) => void;
}

const ItemReport: React.FC<ItemProps> = ({
                                           title,
                                           subtitle,
                                           amount,
                                           type,
                                           color,
                                           categoryId,
                                           isCategory,
                                           onDelete,
                                           transactions,
                                           onUpdate,
                                           onUpdateTransaction,
                                           onDeleteTransaction
                                         }) => {
  const [isOpen, setIsOpen] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [editingNewTransaction, setEditingNewTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
  }, [editingNewTransaction]);

  const handleUpdate = () => {
    if (onUpdate) {
      onUpdate(categoryId, newTitle);
    }
    setIsEditing(false);
  };

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  const handleDelete = () => {
    onDelete(categoryId);
  };

  const handleTransactionUpdate = () => {
    if (editingTransaction && onUpdateTransaction) {
      onUpdateTransaction(editingTransaction.id, editingTransaction);
      setEditingTransaction(null);
    }
  };

  // const handleNewTransactionUpdate = () => {
  //     if (editingTransaction && onUpdateNewTransaction) {
  //         onUpdateNewTransaction(editingTransaction.description, editingTransaction.amount);
  //         setEditingTransaction(null);
  //     }
  // };

  const startEditing = (transaction: Transaction) => {
    setEditingTransaction({ ...transaction });
  };

  const startNewEditing = (transaction: Transaction) => {
    setEditingNewTransaction({ ...transaction });
  };

  const handleTransactionDelete = (transactionId: number) => {
    if (onDeleteTransaction) {
      onDeleteTransaction(transactionId);
    }
  };

  console.log(transactions)


  return (
    <div className={styles.item}>
      <div className={styles.header} onClick={toggleAccordion}>
        <div className={styles.leftContainer}>
          <div className={styles.icon} style={{ backgroundColor: color || '#4f4f4f' }}></div>
          <div className={styles.details}>
            {isCategory && isEditing ? (
              <input
                className={styles.titleUpdate}
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
            ) : (
              <>
                <div className={styles.title}>{title}</div>
                {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
              </>
            )}
          </div>
        </div>
        <div className={styles.rightContainer}>
          <div className={styles.controlButton}>
            {isEditing ? (
              <div className={styles.buttonSave} onClick={handleUpdate}>ОК</div>
            ) : (
              <>
                <div className={styles.update} onClick={() => setIsEditing(true)}></div>
                <div className={styles.delete} onClick={handleDelete}></div>
              </>
            )}
          </div>
          <div
            className={styles.amount}
            style={{ backgroundColor: (type === "expense" ? 'rgba(235, 87, 87, 0.5)' : 'rgba(39, 174, 96, 0.5)') }}>
            {amount}
          </div>
        </div>

      </div>
      {isOpen && (
        <div className={styles.description}>
          {isCategory && transactions?.map(transaction => (
            <div key={transaction.id} className={styles.transaction}>
              {editingTransaction?.id === transaction.id ? (
                <div className={styles.containerUpdate}>
                  <div className={styles.leftContainerEdit}>
                    <div style={{ width: '40px', justifyContent: 'center' }}>
                      <div className={styles.iconUpdate}
                           style={{ backgroundColor: color || '#4f4f4f' }}>
                      </div>
                    </div>
                    <input
                      type="text"
                      className={styles.inputDescription}
                      value={editingTransaction.description}
                      onChange={e => setEditingTransaction({
                        ...editingTransaction,
                        description: e.target.value,
                      })}
                    />
                  </div>
                  <div className={styles.rightContainerEdit}>
                    <input
                      type="number"
                      className={styles.inputAmount}
                      value={editingTransaction.amount}
                      onChange={e => setEditingTransaction({
                        ...editingTransaction,
                        amount: Number(e.target.value),
                      })}
                    />
                    <div className={styles.buttonRight}>
                      <div className={styles.buttonSaveTransaction} onClick={handleTransactionUpdate}>ОК</div>
                    </div>
                  </div>
                </div>

                //   <div className={styles.iconContainer}>
                //       <div className={styles.iconUpdate}
                //            style={{ backgroundColor: color || '#4f4f4f' }}></div>
                //   </div>
                //     <div className={styles.containerData}>
                // <input
                //   type="text"
                //   className={styles.inputDescription}
                //   value={editingTransaction.description}
                //               onChange={e => setEditingTransaction({
                //                   ...editingTransaction,
                //                   description: e.target.value,
                //               })}
                //             />
                //             <input
                //               type="number"
                //               className={styles.inputAmount}
                //               value={editingTransaction.amount}
                //               onChange={e => setEditingTransaction({
                //                   ...editingTransaction,
                //                   amount: Number(e.target.value),
                //               })}
                //             />
                //         </div>
                //         <div className={styles.buttonSaveTransaction} onClick={handleTransactionUpdate}>ОК
                //         </div>
                //     </div>

              ) : (
                <div className={styles.containerUpdate}>
                  <div className={styles.iconContainer}>
                    <div className={styles.iconUpdate}
                         style={{ backgroundColor: color || '#4f4f4f' }}></div>
                  </div>
                  <div className={styles.containerData}>
                                        <span
                                          className={styles.descriptionAccordion}>{transaction.description === '' || null ? 'Опису немає' : transaction.description}</span>
                    <span className={styles.amountAccordion}
                          style={{ backgroundColor: (type === "expense" ? 'rgba(235, 87, 87, 0.5)' : 'rgba(39, 174, 96, 0.5)') }}>{type === "expense" ? '−₴' + formatAmount(transaction.amount) : '+₴' + formatAmount(transaction.amount)}
                                        </span>
                  </div>
                  <div className={styles.containerButton}>
                    <button className={styles.update}
                            onClick={isCategory ? () => startEditing(transaction) : () => startNewEditing(transaction)}>
                    </button>
                    <button className={styles.delete}
                            onClick={() => handleTransactionDelete(transaction.id)}></button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ItemReport;
