import { useRef } from 'react';
import {
  AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader,
  AlertDialogContent, AlertDialogOverlay, Button, HStack, Text
} from '@chakra-ui/react';
import { AlertTriangle, Trash2 } from 'lucide-react';

interface DeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  productName: string;
  deleting: boolean;
}

export function DeleteDialog({ isOpen, onClose, onConfirm, productName, deleting }: DeleteDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  return (
    <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose} isCentered>
      <AlertDialogOverlay backdropFilter="blur(4px)" bg="blackAlpha.400">
        <AlertDialogContent borderRadius="20px" mx={4}>
          <AlertDialogHeader fontSize="16px" fontWeight="700">
            <HStack>
              <AlertTriangle size={18} color="#ea4335" />
              <Text>Delete Product</Text>
            </HStack>
          </AlertDialogHeader>
          <AlertDialogBody fontSize="14px" color="surface.600">
            Are you sure you want to delete <strong>"{productName}"</strong>? This action cannot be undone.
          </AlertDialogBody>
          <AlertDialogFooter gap={3}>
            <Button ref={cancelRef} variant="ghost" size="sm" onClick={onClose} borderRadius="8px">
              Cancel
            </Button>
            <Button
              colorScheme="red"
              size="sm"
              onClick={onConfirm}
              isLoading={deleting}
              loadingText="Deleting..."
              borderRadius="8px"
              bg="google.red"
              _hover={{ bg: '#c5221f' }}
              leftIcon={<Trash2 size={14} />}
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
