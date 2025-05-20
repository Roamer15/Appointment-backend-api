
// import { toast } from 'react-toastify';
// import api from '../services/api';

// export const confirmDelete = async (message) => {
//   const response = await toast.promise(
//     new Promise((resolve) => {
//       toast.info(
//         <div>
//           <p>{message}</p>
//           <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
//             <button 
//               onClick={() => {
//                 toast.dismiss();
//                 resolve(true);
//               }}
//               style={{ padding: '5px 10px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px' }}
//             >
//               Yes
//             </button>
//             <button 
//               onClick={() => {
//                 toast.dismiss();
//                 resolve(false);
//               }}
//               style={{ padding: '5px 10px', background: '#6b7280', color: 'white', border: 'none', borderRadius: '4px' }}
//             >
//               No
//             </button>
//           </div>
//         </div>,
//         {
//           autoClose: false,
//           closeButton: false,
//         }
//       );
//     }),
//     {
//       pending: 'Confirming deletion...',
//     }
//   );

// //   if (response) {
// //     // User clicked "Delete"
// //     await api.deleteSlot(slotId);
// //     toast.success('Slot deleted!');
// //   }
// };
